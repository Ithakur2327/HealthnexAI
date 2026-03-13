const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Personal Information - ALL OPTIONAL
  personalInfo: {
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    bmi: Number
  },
  
  // Lifestyle - ALL OPTIONAL
  lifestyle: {
    physicalActivity: String,
    smokingStatus: String,
    alcoholConsumption: String,
    sleepHours: Number,
    stressLevel: String,
    dietQuality: String
  },
  
  // Medical History
  medicalHistory: {
    chronicConditions: [String],
    currentMedications: [String],
    allergies: [String],
    previousSurgeries: [String],
    recentIllnesses: String
  },
  
  // Family History
  familyHistory: {
    diabetes: { type: Boolean, default: false },
    heartDisease: { type: Boolean, default: false },
    hypertension: { type: Boolean, default: false },
    cancer: { type: Boolean, default: false },
    mentalHealth: { type: Boolean, default: false },
    other: String
  },
  
  // Daily Routine
  dailyRoutine: {
    wakeUpTime: String,
    bedTime: String,
    mealsPerDay: Number,
    waterIntake: Number,
    screenTime: Number,
    exerciseDuration: Number
  },
  
  // Risk Scores (calculated)
  riskScores: {
    diabetesRisk: { type: Number, default: 0 },
    heartDiseaseRisk: { type: Number, default: 0 },
    bloodPressureRisk: { type: Number, default: 0 },
    obesityRisk: { type: Number, default: 0 },
    mentalHealthRisk: { type: Number, default: 0 },
    overallRisk: { type: Number, default: 0 }
  },
  
  // Recommendations
  recommendations: [String],
  
  // Metadata
  status: {
    type: String,
    enum: ['completed', 'incomplete'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Calculate BMI before saving
assessmentSchema.pre('save', function(next) {
  try {
    if (this.personalInfo && this.personalInfo.height && this.personalInfo.weight) {
      const heightInMeters = this.personalInfo.height / 100;
      this.personalInfo.bmi = parseFloat((this.personalInfo.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    next();
  } catch (error) {
    console.error('BMI calculation error:', error);
    next();
  }
});

module.exports = mongoose.model('Assessment', assessmentSchema);