const Chat = require('../models/Chat');
const Assessment = require('../models/Assessment');
const Groq = require('groq-sdk');

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Generate mock response (fallback)
const generateMockResponse = (userMessage, assessmentContext, chatHistory = []) => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for affirmative responses (yes, sure, ok, etc.)
  const isAffirmative = /^(yes|yeah|yep|sure|ok|okay|please|definitely|absolutely|yup|hn|ha|haan)$/i.test(userMessage.trim());
  
  // If user said "yes" and previous message asked a question
  if (isAffirmative && chatHistory.length > 0) {
    const lastMessage = chatHistory[chatHistory.length - 1];
    const lastText = lastMessage.content.toLowerCase();
    
    // Check what was offered in last response
    if (lastText.includes('detailed meal plan') || lastText.includes('meal plan')) {
      return `**7-Day Personalized Meal Plan:**

**Monday:**
- Breakfast: Scrambled eggs with whole grain toast and avocado
- Snack: Greek yogurt with berries
- Lunch: Grilled chicken with quinoa and vegetables
- Snack: Apple with almond butter
- Dinner: Baked salmon with sweet potato and broccoli

**Tuesday:**
- Breakfast: Oatmeal with banana and walnuts
- Snack: Protein shake
- Lunch: Turkey wrap with mixed greens
- Snack: Carrot sticks with hummus
- Dinner: Lean beef stir-fry with brown rice

**Wednesday-Sunday:** (Similar detailed meals...)

**Daily Nutritional Goals:**
- Calories: 1800-2000
- Protein: 120-140g
- Carbs: 180-200g
- Fats: 60-70g

Would you like the exercise routine as well?`;
    }
    
    if (lastText.includes('exercise') || lastText.includes('workout')) {
      return `**Detailed 6-Week Exercise Program:**

**Weeks 1-2: Foundation**

**Monday/Wednesday/Friday:**
- Warm-up: 5 min light jog
- Cardio: 20 min intervals
- Strength: 3 sets bodyweight exercises
- Cool-down: 5 min stretch

**Tuesday/Thursday:**
- 45 min moderate cardio
- Core exercises: 15 min

**Saturday:**
- 60 min outdoor activity

**Sunday:** Rest

**Progression for Weeks 3-6 included...**

Would you like specific exercise demonstrations?`;
    }
  }
  
  // Diabetes queries
  if (lowerMessage.includes('diabetes')) {
    return `Based on your diabetes risk of ${assessmentContext?.diabetesRisk || 0}%, here are personalized recommendations:

**Dietary Changes:**
- Reduce refined sugar to <25g daily
- Increase fiber to 30g per day
- Choose low glycemic foods
- Eat smaller, frequent meals

**Exercise:**
- 30 minutes daily moderate activity
- Mix cardio with strength training
- Post-meal walks help regulate blood sugar

**Monitoring:**
- Track blood glucose if at risk
- Keep food diary
- Monitor weight

Would you like a detailed meal plan or exercise routine?`;
  }
  
  // Default response
  return `Thank you! I can help you with:

- Disease risk reduction strategies
- Personalized nutrition planning
- Exercise and fitness programs
- Stress management techniques
- Sleep optimization
- Weight management

What specific area would you like to explore?`;
};

// @desc    Send message and get AI response
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get or create chat
    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
      if (!chat || chat.user.toString() !== req.user._id.toString()) {
        return res.status(404).json({ message: 'Chat not found' });
      }
    } else {
      chat = await Chat.create({
        user: req.user._id,
        messages: [],
      });
    }

    // Get user's latest assessment for context
    let assessmentContext = null;
    try {
      const assessment = await Assessment.findOne({ user: req.user._id }).sort({ createdAt: -1 });
      if (assessment) {
        assessmentContext = {
          age: assessment.age,
          gender: assessment.gender,
          bmi: (assessment.weight / ((assessment.height / 100) ** 2)).toFixed(1),
          exercise: assessment.exercise,
          sleep: assessment.sleep,
          stress: assessment.stress,
          diet: assessment.diet,
          smoking: assessment.smoking,
          alcohol: assessment.alcohol,
          diabetesRisk: assessment.results.diabetesRisk,
          heartDiseaseRisk: assessment.results.heartDiseaseRisk,
          obesityRisk: assessment.results.obesityRisk,
          mentalHealthRisk: assessment.results.mentalHealthRisk,
          bloodPressureRisk: assessment.results.bloodPressureRisk,
        };
      }
    } catch (err) {
      console.log('No assessment found for context');
    }

    // Add user message to chat
    chat.messages.push({
      role: 'user',
      content: message,
    });

    // Generate AI response using Groq
    let aiResponse;
    
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      console.log('⚠️ No Groq API key - using mock response');
      aiResponse = generateMockResponse(message, assessmentContext, chat.messages);
    } else {
      try {
        console.log('🚀 Calling Groq API...');
        
        // Build system context
        const systemContext = `You are NexAI, a helpful and empathetic health assistant for HealthnexAI platform. You provide personalized health advice based on user's assessment data.

${assessmentContext ? `User's Complete Health Profile:
- Age: ${assessmentContext.age} years
- Gender: ${assessmentContext.gender}
- BMI: ${assessmentContext.bmi} kg/m²
- Daily Exercise: ${assessmentContext.exercise} minutes
- Sleep: ${assessmentContext.sleep} hours per night
- Stress Level: ${assessmentContext.stress}/10
- Diet Type: ${assessmentContext.diet}
- Smoking: ${assessmentContext.smoking}
- Alcohol: ${assessmentContext.alcohol}

Current Health Risk Assessment:
- Diabetes Risk: ${assessmentContext.diabetesRisk}%
- Heart Disease Risk: ${assessmentContext.heartDiseaseRisk}%
- Blood Pressure Risk: ${assessmentContext.bloodPressureRisk}%
- Obesity Risk: ${assessmentContext.obesityRisk}%
- Mental Health Risk: ${assessmentContext.mentalHealthRisk}%` : 'No assessment data available. Encourage user to complete health assessment for personalized recommendations.'}

Core Guidelines:
1. Provide helpful, actionable, and personalized health advice based on the user's health profile
2. Keep responses conversational but detailed when user asks for more information
3. Use clear formatting with bullet points and sections
4. Be empathetic, encouraging, and supportive
5. Always remind users to consult healthcare professionals for medical concerns
6. Focus on lifestyle modifications: diet, exercise, stress management, sleep
7. NEVER diagnose diseases or prescribe medications
8. Maintain conversation context - remember previous messages
9. When user asks for "detail", "more info", "yes" to previous offers - provide comprehensive information
10. Reference user's specific health metrics when giving advice

Response Style:
- Be natural and conversational
- Use sections with headings for detailed info
- Include specific, actionable recommendations
- Provide examples and practical tips
- End with relevant follow-up question or offer`;

        // Build conversation messages for Groq
        const messages = [
          {
            role: 'system',
            content: systemContext
          },
          // Add last 5 messages for context
          ...chat.messages.slice(-6).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        ];

        // Call Groq API
        const completion = await groq.chat.completions.create({
          messages: messages,
          model: 'llama-3.3-70b-versatile', // Fast and good quality
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1,
        });

        aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
        
        console.log('✅ Groq API response received');

      } catch (error) {
        console.error('❌ Groq API Error:', error.message);
        
        // Fallback to mock response
        console.log('→ Using mock response fallback');
        aiResponse = generateMockResponse(message, assessmentContext, chat.messages);
      }
    }

    // Add AI response to chat
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
    });

    await chat.save();

    res.json({
      chatId: chat._id,
      message: aiResponse,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/:chatId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (chat.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all user chats
// @route   GET /api/chat/my-chats
// @access  Private
const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select('title messages updatedAt');

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chat/:chatId
// @access  Private
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (chat.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await chat.deleteOne();
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getMyChats,
  deleteChat,
};