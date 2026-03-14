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

    // Calculate risk scores
    const riskScores = calculateRiskScores(assessmentData);
    assessmentData.riskScores = riskScores;

    // Generate recommendations
    assessmentData.recommendations = generateRecommendations(riskScores, assessmentData);

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

// Calculate risk scores based on assessment data
function calculateRiskScores(data) {
  const personalInfo = data.personalInfo || {};
  const lifestyle = data.lifestyle || {};
  const medicalHistory = data.medicalHistory || {};
  const familyHistory = data.familyHistory || {};
  const dailyRoutine = data.dailyRoutine || {};

  // Calculate BMI
  const height = personalInfo.height || 170;
  const weight = personalInfo.weight || 70;
  const bmi = weight / ((height / 100) ** 2);

  // Initialize risk scores
  let diabetesRisk = 0;
  let heartDiseaseRisk = 0;
  let bloodPressureRisk = 0;
  let obesityRisk = 0;
  let mentalHealthRisk = 0;

  // BMI-based risks
  if (bmi >= 30) {
    obesityRisk += 40;
    diabetesRisk += 25;
    heartDiseaseRisk += 20;
  } else if (bmi >= 25) {
    obesityRisk += 25;
    diabetesRisk += 15;
    heartDiseaseRisk += 10;
  }

  // Age-based risks
  const age = personalInfo.age || 30;
  if (age >= 60) {
    diabetesRisk += 20;
    heartDiseaseRisk += 25;
    bloodPressureRisk += 20;
  } else if (age >= 45) {
    diabetesRisk += 10;
    heartDiseaseRisk += 15;
    bloodPressureRisk += 10;
  }

  // Lifestyle factors
  const physicalActivity = lifestyle.physicalActivity || 'moderate';
  const smokingStatus = lifestyle.smokingStatus || 'never';
  const alcoholConsumption = lifestyle.alcoholConsumption || 'none';
  const sleepHours = lifestyle.sleepHours || 7;
  const stressLevel = lifestyle.stressLevel || 'low';

  // Physical activity
  if (physicalActivity === 'sedentary') {
    diabetesRisk += 15;
    heartDiseaseRisk += 15;
    obesityRisk += 20;
  }

  // Smoking
  if (smokingStatus === 'current') {
    heartDiseaseRisk += 30;
    bloodPressureRisk += 20;
  }

  // Alcohol
  if (alcoholConsumption === 'heavy') {
    heartDiseaseRisk += 15;
    mentalHealthRisk += 20;
  }

  // Sleep
  if (sleepHours < 6) {
    mentalHealthRisk += 25;
    diabetesRisk += 10;
  }

  // Stress
  if (stressLevel === 'high') {
    mentalHealthRisk += 30;
    bloodPressureRisk += 20;
    heartDiseaseRisk += 10;
  }

  // Diet quality
  const dietQuality = lifestyle.dietQuality || 'good';
  if (dietQuality === 'poor') {
    diabetesRisk += 15;
    obesityRisk += 15;
  }

  // Family history
  if (familyHistory.diabetes) diabetesRisk += 25;
  if (familyHistory.heartDisease) heartDiseaseRisk += 25;
  if (familyHistory.hypertension) bloodPressureRisk += 25;
  if (familyHistory.obesity) obesityRisk += 20;
  if (familyHistory.mentalHealth) mentalHealthRisk += 20;

  // Medical history
  const chronicConditions = medicalHistory.chronicConditions || [];
  if (chronicConditions.length > 0) {
    diabetesRisk += 15;
    heartDiseaseRisk += 15;
  }

  // Cap all risks at 100
  diabetesRisk = Math.min(Math.round(diabetesRisk), 100);
  heartDiseaseRisk = Math.min(Math.round(heartDiseaseRisk), 100);
  bloodPressureRisk = Math.min(Math.round(bloodPressureRisk), 100);
  obesityRisk = Math.min(Math.round(obesityRisk), 100);
  mentalHealthRisk = Math.min(Math.round(mentalHealthRisk), 100);

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

// Generate personalized recommendations
function generateRecommendations(riskScores, data) {
  const recommendations = [];
  const personalInfo = data.personalInfo || {};
  const lifestyle = data.lifestyle || {};

  // Calculate BMI
  const height = personalInfo.height || 170;
  const weight = personalInfo.weight || 70;
  const bmi = weight / ((height / 100) ** 2);

  // Diabetes recommendations
  if (riskScores.diabetesRisk >= 60) {
    recommendations.push('⚠️ HIGH RISK: Consult a healthcare provider immediately for diabetes screening');
    recommendations.push('Monitor blood sugar levels regularly');
    recommendations.push('Adopt a low-glycemic diet rich in fiber');
  } else if (riskScores.diabetesRisk >= 30) {
    recommendations.push('⚡ MODERATE RISK: Schedule regular diabetes checkups');
    recommendations.push('Reduce sugar and refined carbohydrate intake');
    recommendations.push('Maintain a healthy weight through balanced diet');
  } else {
    recommendations.push('✅ LOW RISK: Continue maintaining healthy lifestyle habits');
  }

  // Heart disease recommendations
  if (riskScores.heartDiseaseRisk >= 60) {
    recommendations.push('⚠️ HIGH RISK: Urgent cardiovascular screening recommended');
    recommendations.push('Consider cardiac consultation for detailed evaluation');
    recommendations.push('Adopt heart-healthy Mediterranean diet');
  } else if (riskScores.heartDiseaseRisk >= 30) {
    recommendations.push('⚡ Monitor blood pressure and cholesterol levels regularly');
    recommendations.push('Engage in 150 minutes of moderate aerobic exercise weekly');
  }

  // Obesity recommendations
  if (bmi >= 30) {
    recommendations.push('⚠️ Focus on gradual weight loss (1-2 lbs per week)');
    recommendations.push('Create a calorie deficit through diet and exercise');
    recommendations.push('Consider consulting a nutritionist for personalized meal plan');
  } else if (bmi >= 25) {
    recommendations.push('⚡ Maintain current weight and increase physical activity');
    recommendations.push('Practice portion control and mindful eating');
  }

  // Mental health recommendations
  if (riskScores.mentalHealthRisk >= 60) {
    recommendations.push('⚠️ HIGH STRESS: Consider professional mental health support');
    recommendations.push('Practice daily stress-reduction techniques (meditation, yoga)');
    recommendations.push('Ensure 7-9 hours of quality sleep nightly');
  } else if (riskScores.mentalHealthRisk >= 30) {
    recommendations.push('⚡ Incorporate relaxation techniques into daily routine');
    recommendations.push('Maintain work-life balance and social connections');
  }

  // Lifestyle recommendations
  if (lifestyle.physicalActivity === 'sedentary') {
    recommendations.push('🏃 Start with 30 minutes of moderate exercise 5 days a week');
    recommendations.push('Take regular breaks from sitting every hour');
  }

  if (lifestyle.smokingStatus === 'current') {
    recommendations.push('🚭 CRITICAL: Quit smoking - seek smoking cessation program');
    recommendations.push('Avoid secondhand smoke exposure');
  }

  if (lifestyle.sleepHours < 7) {
    recommendations.push('😴 Improve sleep hygiene - aim for 7-9 hours nightly');
    recommendations.push('Establish consistent sleep schedule');
  }

  // General recommendations
  recommendations.push('💧 Stay hydrated - drink 8-10 glasses of water daily');
  recommendations.push('🥗 Eat a balanced diet rich in fruits, vegetables, and whole grains');
  recommendations.push('📊 Track your health metrics regularly');

  return recommendations;
}

module.exports = exports;