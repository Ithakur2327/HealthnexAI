const Assessment = require('../models/Assessment');

// Create new assessment
exports.createAssessment = async (req, res) => {
  try {
    const assessmentData = {
      userId: req.user.id,
      personalInfo: req.body.personalInfo || {},
      lifestyle: req.body.lifestyle || {},
      medicalHistory: req.body.medicalHistory || {},
      familyHistory: req.body.familyHistory || {},
      dailyRoutine: req.body.dailyRoutine || {}
    };

    // Calculate risk scores with ADVANCED ALGORITHM
    const riskScores = calculateAdvancedRiskScores(assessmentData);
    assessmentData.riskScores = riskScores;

    // Generate detailed recommendations
    assessmentData.recommendations = generateDetailedRecommendations(riskScores, assessmentData);

    const assessment = await Assessment.create(assessmentData);

    res.status(201).json({
      success: true,
      message: 'Assessment completed successfully',
      assessment
    });
  } catch (error) {
    console.error('Assessment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create assessment',
      error: error.message
    });
  }
};

// Get all assessments for current user
exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assessments.length,
      assessments
    });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessments',
      error: error.message
    });
  }
};

// Get latest assessment
exports.getLatestAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'No assessments found'
      });
    }

    res.status(200).json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error('Get latest assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest assessment',
      error: error.message
    });
  }
};

// Get assessment by ID
exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.status(200).json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error('Get assessment by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment',
      error: error.message
    });
  }
};

// Delete assessment
exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully'
    });
  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete assessment',
      error: error.message
    });
  }
};

// ==================== ADVANCED RISK CALCULATION ALGORITHM ====================

function calculateAdvancedRiskScores(data) {
  const personalInfo = data.personalInfo || {};
  const lifestyle = data.lifestyle || {};
  const medicalHistory = data.medicalHistory || {};
  const familyHistory = data.familyHistory || {};
  const dailyRoutine = data.dailyRoutine || {};

  // Extract and validate data
  const age = Number(personalInfo.age) || 30;
  const gender = personalInfo.gender || 'male';
  const height = Number(personalInfo.height) || 170;
  const weight = Number(personalInfo.weight) || 70;
  
  // Calculate BMI
  const bmi = weight / ((height / 100) ** 2);
  
  // Get lifestyle factors
  const physicalActivity = lifestyle.physicalActivity || 'moderate';
  const smokingStatus = lifestyle.smokingStatus || 'never';
  const alcoholConsumption = lifestyle.alcoholConsumption || 'none';
  const sleepHours = Number(lifestyle.sleepHours) || 7;
  const stressLevel = lifestyle.stressLevel || 'low';
  const dietQuality = lifestyle.dietQuality || 'good';
  
  // Get daily routine
  const waterIntake = Number(dailyRoutine.waterIntake) || 8;
  const exerciseDuration = Number(dailyRoutine.exerciseDuration) || 30;
  const screenTime = Number(dailyRoutine.screenTime) || 4;
  const mealsPerDay = Number(dailyRoutine.mealsPerDay) || 3;

  // Calculate each disease risk
  const diabetesRisk = calculateDiabetesRisk({
    age, gender, bmi, physicalActivity, dietQuality, sleepHours,
    familyHistory: familyHistory.diabetes,
    medicalHistory: medicalHistory.chronicConditions,
    stressLevel, waterIntake
  });

  const heartDiseaseRisk = calculateHeartDiseaseRisk({
    age, gender, bmi, smokingStatus, alcoholConsumption, physicalActivity,
    stressLevel, sleepHours, familyHistory: familyHistory.heartDisease,
    medicalHistory: medicalHistory.chronicConditions,
    exerciseDuration, dietQuality
  });

  const bloodPressureRisk = calculateBloodPressureRisk({
    age, gender, bmi, smokingStatus, alcoholConsumption, stressLevel,
    physicalActivity, sleepHours, familyHistory: familyHistory.hypertension,
    waterIntake, dietQuality
  });

  const obesityRisk = calculateObesityRisk({
    bmi, age, physicalActivity, dietQuality, sleepHours,
    familyHistory: familyHistory.obesity, mealsPerDay,
    exerciseDuration, stressLevel
  });

  const mentalHealthRisk = calculateMentalHealthRisk({
    age, stressLevel, sleepHours, alcoholConsumption, physicalActivity,
    familyHistory: familyHistory.mentalHealth, screenTime,
    exerciseDuration, gender
  });

  // Calculate overall risk
  const overallRisk = Math.round(
    (diabetesRisk + heartDiseaseRisk + bloodPressureRisk + obesityRisk + mentalHealthRisk) / 5
  );

  return {
    diabetesRisk,
    heartDiseaseRisk,
    bloodPressureRisk,
    obesityRisk,
    mentalHealthRisk,
    overallRisk
  };
}

// ==================== DIABETES RISK CALCULATION ====================
function calculateDiabetesRisk(factors) {
  let risk = 0;
  
  // Age factor (0-25 points) - Non-linear progression
  if (factors.age >= 65) risk += 25;
  else if (factors.age >= 55) risk += 20;
  else if (factors.age >= 45) risk += 15;
  else if (factors.age >= 35) risk += 8;
  else if (factors.age >= 25) risk += 3;
  
  // BMI factor (0-30 points) - Critical factor
  if (factors.bmi >= 35) risk += 30;
  else if (factors.bmi >= 30) risk += 25;
  else if (factors.bmi >= 27) risk += 18;
  else if (factors.bmi >= 25) risk += 12;
  else if (factors.bmi >= 23) risk += 6;
  else if (factors.bmi < 18.5) risk += 5; // Underweight also risky
  
  // Physical Activity (0-20 points)
  if (factors.physicalActivity === 'sedentary') risk += 20;
  else if (factors.physicalActivity === 'light') risk += 12;
  else if (factors.physicalActivity === 'moderate') risk += 5;
  else if (factors.physicalActivity === 'active') risk += 0;
  
  // Diet Quality (0-18 points)
  if (factors.dietQuality === 'poor') risk += 18;
  else if (factors.dietQuality === 'fair') risk += 10;
  else if (factors.dietQuality === 'good') risk += 3;
  else if (factors.dietQuality === 'excellent') risk += 0;
  
  // Sleep (0-12 points)
  if (factors.sleepHours < 5) risk += 12;
  else if (factors.sleepHours < 6) risk += 8;
  else if (factors.sleepHours < 7) risk += 5;
  else if (factors.sleepHours > 9) risk += 6;
  
  // Family History (0-25 points) - Strong genetic component
  if (factors.familyHistory) risk += 25;
  
  // Chronic Conditions (0-15 points)
  if (factors.medicalHistory && factors.medicalHistory.length > 0) {
    risk += Math.min(factors.medicalHistory.length * 5, 15);
  }
  
  // Stress Level (0-8 points)
  if (factors.stressLevel === 'high') risk += 8;
  else if (factors.stressLevel === 'moderate') risk += 4;
  
  // Hydration (0-5 points)
  if (factors.waterIntake < 4) risk += 5;
  else if (factors.waterIntake < 6) risk += 3;
  
  // Gender factor
  if (factors.gender === 'female' && factors.age > 40) risk += 3;
  
  // Add some realistic variance (±3 points)
  const variance = Math.floor(Math.random() * 7) - 3;
  risk += variance;
  
  return Math.max(0, Math.min(Math.round(risk), 100));
}

// ==================== HEART DISEASE RISK CALCULATION ====================
function calculateHeartDiseaseRisk(factors) {
  let risk = 0;
  
  // Age factor (0-28 points)
  if (factors.age >= 70) risk += 28;
  else if (factors.age >= 60) risk += 24;
  else if (factors.age >= 50) risk += 18;
  else if (factors.age >= 40) risk += 12;
  else if (factors.age >= 30) risk += 6;
  
  // Gender and age interaction
  if (factors.gender === 'male' && factors.age >= 45) risk += 5;
  if (factors.gender === 'female' && factors.age >= 55) risk += 5;
  
  // BMI factor (0-22 points)
  if (factors.bmi >= 35) risk += 22;
  else if (factors.bmi >= 30) risk += 18;
  else if (factors.bmi >= 27) risk += 12;
  else if (factors.bmi >= 25) risk += 7;
  
  // Smoking (0-30 points) - Highest risk factor
  if (factors.smokingStatus === 'current') risk += 30;
  else if (factors.smokingStatus === 'former') risk += 12;
  
  // Alcohol (0-15 points)
  if (factors.alcoholConsumption === 'heavy') risk += 15;
  else if (factors.alcoholConsumption === 'moderate') risk += 5;
  
  // Physical Activity (0-18 points)
  if (factors.physicalActivity === 'sedentary') risk += 18;
  else if (factors.physicalActivity === 'light') risk += 10;
  else if (factors.physicalActivity === 'moderate') risk += 4;
  
  // Exercise Duration (bonus protection)
  if (factors.exerciseDuration >= 45) risk -= 5;
  else if (factors.exerciseDuration >= 30) risk -= 2;
  
  // Stress (0-15 points)
  if (factors.stressLevel === 'high') risk += 15;
  else if (factors.stressLevel === 'moderate') risk += 8;
  
  // Sleep (0-10 points)
  if (factors.sleepHours < 6) risk += 10;
  else if (factors.sleepHours < 7) risk += 5;
  else if (factors.sleepHours > 9) risk += 4;
  
  // Family History (0-25 points)
  if (factors.familyHistory) risk += 25;
  
  // Diet Quality (0-12 points)
  if (factors.dietQuality === 'poor') risk += 12;
  else if (factors.dietQuality === 'fair') risk += 6;
  
  // Chronic Conditions (0-15 points)
  if (factors.medicalHistory && factors.medicalHistory.length > 0) {
    risk += Math.min(factors.medicalHistory.length * 5, 15);
  }
  
  // Variance
  const variance = Math.floor(Math.random() * 7) - 3;
  risk += variance;
  
  return Math.max(0, Math.min(Math.round(risk), 100));
}

// ==================== BLOOD PRESSURE RISK CALCULATION ====================
function calculateBloodPressureRisk(factors) {
  let risk = 0;
  
  // Age factor (0-24 points)
  if (factors.age >= 65) risk += 24;
  else if (factors.age >= 55) risk += 20;
  else if (factors.age >= 45) risk += 14;
  else if (factors.age >= 35) risk += 8;
  
  // BMI factor (0-20 points)
  if (factors.bmi >= 35) risk += 20;
  else if (factors.bmi >= 30) risk += 16;
  else if (factors.bmi >= 27) risk += 11;
  else if (factors.bmi >= 25) risk += 6;
  
  // Smoking (0-25 points)
  if (factors.smokingStatus === 'current') risk += 25;
  else if (factors.smokingStatus === 'former') risk += 10;
  
  // Alcohol (0-14 points)
  if (factors.alcoholConsumption === 'heavy') risk += 14;
  else if (factors.alcoholConsumption === 'moderate') risk += 6;
  
  // Stress (0-22 points) - Major factor for BP
  if (factors.stressLevel === 'high') risk += 22;
  else if (factors.stressLevel === 'moderate') risk += 11;
  
  // Physical Activity (0-16 points)
  if (factors.physicalActivity === 'sedentary') risk += 16;
  else if (factors.physicalActivity === 'light') risk += 9;
  else if (factors.physicalActivity === 'moderate') risk += 4;
  
  // Sleep (0-10 points)
  if (factors.sleepHours < 6) risk += 10;
  else if (factors.sleepHours < 7) risk += 6;
  
  // Family History (0-25 points)
  if (factors.familyHistory) risk += 25;
  
  // Diet Quality (0-15 points) - Sodium intake matters
  if (factors.dietQuality === 'poor') risk += 15;
  else if (factors.dietQuality === 'fair') risk += 8;
  
  // Water Intake (0-8 points)
  if (factors.waterIntake < 4) risk += 8;
  else if (factors.waterIntake < 6) risk += 4;
  
  // Gender factor
  if (factors.gender === 'male') risk += 4;
  
  // Variance
  const variance = Math.floor(Math.random() * 7) - 3;
  risk += variance;
  
  return Math.max(0, Math.min(Math.round(risk), 100));
}

// ==================== OBESITY RISK CALCULATION ====================
function calculateObesityRisk(factors) {
  let risk = 0;
  
  // BMI factor (0-45 points) - Primary indicator
  if (factors.bmi >= 35) risk += 45;
  else if (factors.bmi >= 32) risk += 38;
  else if (factors.bmi >= 30) risk += 32;
  else if (factors.bmi >= 27) risk += 24;
  else if (factors.bmi >= 25) risk += 16;
  else if (factors.bmi >= 23) risk += 8;
  else if (factors.bmi < 18.5) risk += 10; // Underweight
  else risk += 0;
  
  // Physical Activity (0-25 points)
  if (factors.physicalActivity === 'sedentary') risk += 25;
  else if (factors.physicalActivity === 'light') risk += 15;
  else if (factors.physicalActivity === 'moderate') risk += 7;
  
  // Exercise Duration (bonus)
  if (factors.exerciseDuration >= 60) risk -= 8;
  else if (factors.exerciseDuration >= 45) risk -= 5;
  else if (factors.exerciseDuration >= 30) risk -= 2;
  
  // Diet Quality (0-20 points)
  if (factors.dietQuality === 'poor') risk += 20;
  else if (factors.dietQuality === 'fair') risk += 12;
  else if (factors.dietQuality === 'good') risk += 5;
  
  // Meals Per Day (0-10 points)
  if (factors.mealsPerDay <= 1) risk += 10;
  else if (factors.mealsPerDay === 2) risk += 6;
  else if (factors.mealsPerDay >= 5) risk += 8; // Too many meals
  
  // Sleep (0-12 points)
  if (factors.sleepHours < 6) risk += 12;
  else if (factors.sleepHours < 7) risk += 7;
  else if (factors.sleepHours > 9) risk += 8;
  
  // Age factor (0-10 points)
  if (factors.age >= 50) risk += 10;
  else if (factors.age >= 40) risk += 6;
  else if (factors.age >= 30) risk += 3;
  
  // Family History (0-20 points)
  if (factors.familyHistory) risk += 20;
  
  // Stress (0-10 points) - Stress eating
  if (factors.stressLevel === 'high') risk += 10;
  else if (factors.stressLevel === 'moderate') risk += 5;
  
  // Variance
  const variance = Math.floor(Math.random() * 7) - 3;
  risk += variance;
  
  return Math.max(0, Math.min(Math.round(risk), 100));
}

// ==================== MENTAL HEALTH RISK CALCULATION ====================
function calculateMentalHealthRisk(factors) {
  let risk = 0;
  
  // Stress Level (0-35 points) - Primary factor
  if (factors.stressLevel === 'high') risk += 35;
  else if (factors.stressLevel === 'moderate') risk += 20;
  else if (factors.stressLevel === 'low') risk += 5;
  
  // Sleep (0-30 points) - Critical for mental health
  if (factors.sleepHours < 5) risk += 30;
  else if (factors.sleepHours < 6) risk += 22;
  else if (factors.sleepHours < 7) risk += 14;
  else if (factors.sleepHours > 10) risk += 12;
  
  // Physical Activity (0-18 points) - Exercise helps mental health
  if (factors.physicalActivity === 'sedentary') risk += 18;
  else if (factors.physicalActivity === 'light') risk += 10;
  else if (factors.physicalActivity === 'moderate') risk += 4;
  
  // Exercise Duration (bonus)
  if (factors.exerciseDuration >= 45) risk -= 6;
  else if (factors.exerciseDuration >= 30) risk -= 3;
  
  // Alcohol (0-20 points)
  if (factors.alcoholConsumption === 'heavy') risk += 20;
  else if (factors.alcoholConsumption === 'moderate') risk += 8;
  
  // Screen Time (0-15 points)
  if (factors.screenTime >= 8) risk += 15;
  else if (factors.screenTime >= 6) risk += 10;
  else if (factors.screenTime >= 4) risk += 5;
  
  // Family History (0-22 points)
  if (factors.familyHistory) risk += 22;
  
  // Age factor (0-12 points)
  if (factors.age >= 60) risk += 4;
  else if (factors.age >= 45) risk += 2;
  else if (factors.age >= 18 && factors.age <= 25) risk += 12; // Young adults higher risk
  
  // Gender factor
  if (factors.gender === 'female') risk += 5;
  
  // Variance
  const variance = Math.floor(Math.random() * 7) - 3;
  risk += variance;
  
  return Math.max(0, Math.min(Math.round(risk), 100));
}

// ==================== DETAILED RECOMMENDATIONS ====================
function generateDetailedRecommendations(riskScores, data) {
  const recommendations = [];
  const personalInfo = data.personalInfo || {};
  const lifestyle = data.lifestyle || {};
  const dailyRoutine = data.dailyRoutine || {};
  
  const age = Number(personalInfo.age) || 30;
  const height = Number(personalInfo.height) || 170;
  const weight = Number(personalInfo.weight) || 70;
  const bmi = weight / ((height / 100) ** 2);

  // Priority recommendations based on highest risks
  const risks = [
    { name: 'Diabetes', value: riskScores.diabetesRisk },
    { name: 'Heart Disease', value: riskScores.heartDiseaseRisk },
    { name: 'Blood Pressure', value: riskScores.bloodPressureRisk },
    { name: 'Obesity', value: riskScores.obesityRisk },
    { name: 'Mental Health', value: riskScores.mentalHealthRisk }
  ].sort((a, b) => b.value - a.value);

  // Critical Alert
  if (risks[0].value >= 70) {
    recommendations.push(`🚨 CRITICAL: Your ${risks[0].name} risk is very high (${risks[0].value}%). Immediate medical consultation strongly recommended.`);
  }

  // Diabetes Recommendations
  if (riskScores.diabetesRisk >= 60) {
    recommendations.push('🩺 DIABETES HIGH RISK: Schedule HbA1c and fasting glucose tests immediately');
    recommendations.push('📊 Monitor blood sugar levels daily, especially fasting and 2 hours post-meal');
    recommendations.push('🥗 Adopt a low-GI diet: whole grains, leafy vegetables, lean proteins');
    if (bmi >= 25) recommendations.push('⚖️ Aim for 5-7% body weight reduction over next 6 months');
  } else if (riskScores.diabetesRisk >= 30) {
    recommendations.push('🩺 Diabetes Prevention: Get HbA1c test annually');
    recommendations.push('🥗 Reduce refined carbohydrates and added sugars');
    recommendations.push('🚶 Walk for 30 minutes after meals to improve glucose metabolism');
  }

  // Heart Disease Recommendations
  if (riskScores.heartDiseaseRisk >= 60) {
    recommendations.push('❤️ HEART DISEASE HIGH RISK: Get ECG, lipid profile, and cardiac consultation');
    recommendations.push('🧂 Strictly limit sodium to <1500mg/day, avoid processed foods');
    recommendations.push('🐟 Include omega-3 rich foods: fatty fish 3x/week, walnuts, flaxseeds');
    if (lifestyle.smokingStatus === 'current') {
      recommendations.push('🚭 URGENT: Quit smoking - reduces heart attack risk by 50% in 1 year');
    }
  } else if (riskScores.heartDiseaseRisk >= 30) {
    recommendations.push('❤️ Heart Health: Get lipid profile test annually');
    recommendations.push('🏃 Include aerobic exercise: swimming, cycling, or brisk walking 150 min/week');
    recommendations.push('🥑 Adopt Mediterranean diet: olive oil, nuts, fish, vegetables');
  }

  // Blood Pressure Recommendations
  if (riskScores.bloodPressureRisk >= 60) {
    recommendations.push('💓 HIGH BP RISK: Monitor blood pressure twice daily, keep log for doctor');
    recommendations.push('🧂 DASH Diet: Reduce salt, increase potassium (bananas, sweet potatoes, spinach)');
    recommendations.push('🧘 Practice stress reduction: 10 min meditation or deep breathing daily');
  } else if (riskScores.bloodPressureRisk >= 30) {
    recommendations.push('💓 BP Prevention: Check blood pressure monthly');
    recommendations.push('🥗 Increase potassium-rich foods, limit caffeine and alcohol');
  }

  // Obesity Recommendations
  if (riskScores.obesityRisk >= 60) {
    recommendations.push(`⚖️ OBESITY HIGH RISK (BMI: ${bmi.toFixed(1)}): Consult nutritionist for structured weight loss plan`);
    recommendations.push('🍽️ Calorie deficit: Reduce daily intake by 500 calories for 0.5kg/week weight loss');
    recommendations.push('🏋️ Combine cardio (5x/week) with strength training (3x/week)');
    recommendations.push('📱 Track meals, calories, and weight daily using app or journal');
  } else if (riskScores.obesityRisk >= 30) {
    recommendations.push(`⚖️ Weight Management (BMI: ${bmi.toFixed(1)}): Aim for healthy BMI 18.5-24.9`);
    recommendations.push('🚶 Increase NEAT (Non-Exercise Activity): take stairs, walk during calls');
    recommendations.push('🍽️ Practice portion control: use smaller plates, eat slowly');
  }

  // Mental Health Recommendations
  if (riskScores.mentalHealthRisk >= 60) {
    recommendations.push('🧠 MENTAL HEALTH HIGH RISK: Consider professional counseling or therapy');
    recommendations.push('😴 Sleep Hygiene: Maintain 7-9 hours, consistent schedule, dark cool room');
    recommendations.push('🧘 Daily Practice: 15 min meditation, yoga, or mindfulness exercises');
    recommendations.push('👥 Social Connection: Spend quality time with friends/family weekly');
    if (dailyRoutine.screenTime >= 6) {
      recommendations.push('📱 Digital Detox: Reduce screen time to <4 hours, no screens 1 hour before bed');
    }
  } else if (riskScores.mentalHealthRisk >= 30) {
    recommendations.push('🧠 Mental Wellness: Practice stress management techniques daily');
    recommendations.push('🌳 Nature Time: Spend 20 minutes outdoors in natural setting daily');
    recommendations.push('📝 Journaling: Write thoughts/feelings for 10 minutes before bed');
  }

  // Lifestyle-specific recommendations
  if (lifestyle.physicalActivity === 'sedentary') {
    recommendations.push('🏃 URGENT: Start with 10 min walks, gradually increase to 30 min/day');
    recommendations.push('⏰ Set hourly movement reminders: stand, stretch, walk for 2-3 minutes');
  }

  if (lifestyle.sleepHours < 7) {
    recommendations.push(`😴 Sleep Priority: Increase from ${lifestyle.sleepHours}h to 7-9h nightly`);
    recommendations.push('🌙 Bedtime Routine: Same time daily, limit caffeine after 2 PM');
  }

  if (dailyRoutine.waterIntake < 8) {
    recommendations.push(`💧 Hydration: Increase water intake to 8-10 glasses daily (currently ${dailyRoutine.waterIntake})`);
  }

  // General recommendations
  recommendations.push('📅 Schedule annual comprehensive health checkup including all major screenings');
  recommendations.push('📊 Track health metrics weekly: weight, BP, activity, sleep, mood');
  recommendations.push('🍎 80/20 Rule: Eat healthy 80% of time, allow flexibility 20%');
  
  return recommendations;
}

module.exports = exports;