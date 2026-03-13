const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  console.log('\n🔍 Testing available Gemini models...\n');
  
  const modelsToTry = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro-002'
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello');
      const response = await result.response;
      console.log(`✅ ${modelName} - WORKS!`);
      console.log(`   Response: ${response.text().substring(0, 50)}...\n`);
    } catch (error) {
      console.log(`❌ ${modelName} - FAILED`);
      console.log(`   Error: ${error.message.split('\n')[0]}\n`);
    }
  }
  
  console.log('Testing complete!');
  process.exit(0);
}

testModels();