import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { assessmentAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Assessment() {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    age: '',
    gender: '',
    height: '',
    weight: '',
    
    // Step 2: Lifestyle Habits
    sleep: '',
    exercise: '',
    exerciseType: '',
    stress: '',
    diet: '',
    smoking: '',
    alcohol: '',
    
    // Step 3: Medical History
    existingConditions: [],
    medications: '',
    allergies: '',
    surgeries: '',
    
    // Step 4: Family History
    familyDiabetes: false,
    familyHeartDisease: false,
    familyBloodPressure: false,
    familyObesity: false,
    familyMentalHealth: false,
    familyNone: false,
    
    // Step 5: Daily Routine
    workType: '',
    screenTime: '',
    waterIntake: '',
    mealFrequency: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'existingConditions') {
      const updatedConditions = checked
        ? [...formData.existingConditions, value]
        : formData.existingConditions.filter(item => item !== value);
      
      setFormData({
        ...formData,
        existingConditions: updatedConditions,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.age && formData.gender && formData.height && formData.weight;
      case 2:
        return formData.sleep && formData.exercise && formData.exerciseType && 
               formData.stress && formData.diet && formData.smoking && formData.alcohol;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return formData.workType && formData.screenTime && 
               formData.waterIntake && formData.mealFrequency;
      default:
        return false;
    }
  };

  const nextStep = () => {
  if (validateStep(currentStep)) {
    setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    toast.warning('Please fill all required fields before continuing');
  }
};

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateBMI = () => {
    const heightInMeters = formData.height / 100;
    const bmi = formData.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600 dark:text-blue-400' };
    if (bmi < 25) return { label: 'Normal', color: 'text-emerald-600 dark:text-emerald-400' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Obese', color: 'text-red-600 dark:text-red-400' };
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateStep(5)) {
    toast.error('Please fill all required fields');
    return;
  }

  setIsSubmitting(true);
  setError('');

  try {
    const result = await assessmentAPI.create(formData);
    toast.success('Assessment completed successfully! Viewing your results...');
    setIsSubmitting(false);
    navigate('/results');
  } catch (error) {
    setIsSubmitting(false);
    const errorMessage = error.response?.data?.message || 'Failed to submit assessment. Please try again.';
    setError(errorMessage);
    toast.error(errorMessage);
  }
};

  const steps = [
    { number: 1, title: 'Basic Info', icon: '👤' },
    { number: 2, title: 'Lifestyle', icon: '🏃' },
    { number: 3, title: 'Medical History', icon: '🏥' },
    { number: 4, title: 'Family History', icon: '👨‍👩‍👧‍👦' },
    { number: 5, title: 'Daily Routine', icon: '📋' }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Health Assessment
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete this assessment to get personalized health insights
            </p>
          </motion.div>

          {/* Enhanced Progress Steps with Line */}
          <div className="mb-10 relative">
            {/* Connecting Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 hidden md:block" style={{ zIndex: 0 }}>
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-5 gap-2 md:gap-4 relative" style={{ zIndex: 1 }}>
              {steps.map((step) => (
                <motion.div 
                  key={step.number}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: step.number * 0.1 }}
                  className="flex flex-col items-center"
                >
                  {/* Circle with Icon */}
                  <motion.div
                    animate={{
                      scale: currentStep === step.number ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      currentStep === step.number
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/50'
                        : currentStep > step.number
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xl">{step.icon}</span>
                    )}
                  </motion.div>

                  {/* Title */}
                  <span
                    className={`mt-2 text-[10px] md:text-xs font-semibold text-center transition-all duration-300 ${
                      currentStep === step.number
                        ? 'text-cyan-600 dark:text-cyan-400'
                        : currentStep > step.number
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Step Counter */}
            <div className="text-center mt-4">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Step {currentStep} of {steps.length}
              </span>
            </div>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg"
              >
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8"
          >
            <form onSubmit={handleSubmit}>
              
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-xl">
                      👤
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Basic Information</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        placeholder="Enter your age"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Height (cm) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        placeholder="e.g., 170"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Weight (kg) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        placeholder="e.g., 65"
                        required
                      />
                    </div>
                  </div>

                  {formData.height && formData.weight && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-xl border-2 border-cyan-200 dark:border-cyan-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-cyan-800 dark:text-cyan-300">Your BMI</p>
                          <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-200">{calculateBMI()} kg/m²</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${getBMICategory(parseFloat(calculateBMI())).color}`}>
                            {getBMICategory(parseFloat(calculateBMI())).label}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 2: Lifestyle Habits */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-xl">
                      🏃
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lifestyle Habits</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Sleep Duration (hours) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="sleep"
                        value={formData.sleep}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        placeholder="e.g., 7"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Exercise (minutes/day) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="exercise"
                        value={formData.exercise}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        placeholder="e.g., 30"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Exercise Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="exerciseType"
                        value={formData.exerciseType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="cardio">Cardio</option>
                        <option value="strength">Strength Training</option>
                        <option value="yoga">Yoga/Pilates</option>
                        <option value="sports">Sports</option>
                        <option value="mixed">Mixed</option>
                        <option value="none">None</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Stress Level (1-10) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="stress"
                        value={formData.stress}
                        onChange={handleChange}
                        min="1"
                        max="10"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        placeholder="1 (Low) - 10 (High)"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Diet Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="diet"
                        value={formData.diet}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select diet</option>
                        <option value="balanced">Balanced</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="non-vegetarian">Non-Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="keto">Keto</option>
                        <option value="junk">Mostly Junk Food</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Smoking Habit <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="smoking"
                        value={formData.smoking}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select option</option>
                        <option value="never">Never</option>
                        <option value="rarely">Rarely (Social)</option>
                        <option value="regular">Regular</option>
                        <option value="heavy">Heavy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Alcohol Consumption <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="alcohol"
                        value={formData.alcohol}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select option</option>
                        <option value="never">Never</option>
                        <option value="rarely">Rarely</option>
                        <option value="moderate">Moderate</option>
                        <option value="heavy">Heavy</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Medical History */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-xl">
                      🏥
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical History</h2>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Existing Conditions (Select all that apply)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {['Diabetes', 'Hypertension', 'Heart Disease', 'Obesity', 'Mental Health'].map((condition) => (
                        <label key={condition} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all border-2 border-transparent hover:border-cyan-500">
                          <input
                            type="checkbox"
                            name="existingConditions"
                            value={condition}
                            checked={formData.existingConditions.includes(condition)}
                            onChange={handleChange}
                            className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{condition}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Current Medications
                    </label>
                    <textarea
                      name="medications"
                      value={formData.medications}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white resize-none transition-all"
                      placeholder="List any medications you're currently taking (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Allergies
                    </label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white resize-none transition-all"
                      placeholder="Any known allergies? (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Past Surgeries
                    </label>
                    <textarea
                      name="surgeries"
                      value={formData.surgeries}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white resize-none transition-all"
                      placeholder="Any past surgeries? (optional)"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Family History */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-xl">
                      👨‍👩‍👧‍👦
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Family History</h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Do any of your immediate family members (parents, siblings) have the following conditions?
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: 'familyNone', label: 'None' },
                      { name: 'familyDiabetes', label: 'Diabetes' },
                      { name: 'familyHeartDisease', label: 'Heart Disease' },
                      { name: 'familyBloodPressure', label: 'High Blood Pressure' },
                      { name: 'familyMentalHealth', label: 'Mental Health Issues' },
                    ].map((item) => (
                      <label key={item.name} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all border-2 border-transparent hover:border-cyan-500">
                        <input
                          type="checkbox"
                          name={item.name}
                          checked={formData[item.name]}
                          onChange={handleChange}
                          className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Daily Routine */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-xl">
                      📋
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Routine</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Work Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="workType"
                        value={formData.workType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select work type</option>
                        <option value="sedentary">Sedentary (Desk Job)</option>
                        <option value="light">Light Activity</option>
                        <option value="moderate">Moderate Activity</option>
                        <option value="heavy">Heavy Physical Work</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Screen Time (hours/day) <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="screenTime"
                        value={formData.screenTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select screen time</option>
                        <option value="0-2">0-2 hours</option>
                        <option value="2-4">2-4 hours</option>
                        <option value="4-6">4-6 hours</option>
                        <option value="6-8">6-8 hours</option>
                        <option value="8+">8+ hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Water Intake (glasses/day) <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="waterIntake"
                        value={formData.waterIntake}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select water intake</option>
                        <option value="0-2">0-2 glasses</option>
                        <option value="2-4">2-4 glasses</option>
                        <option value="4-6">4-6 glasses</option>
                        <option value="6-8">6-8 glasses</option>
                        <option value="8+">8+ glasses</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Meal Frequency <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="mealFrequency"
                        value={formData.mealFrequency}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-gray-900 dark:text-white transition-all"
                        required
                      >
                        <option value="">Select meal frequency</option>
                        <option value="1-2">1-2 meals/day</option>
                        <option value="3">3 meals/day</option>
                        <option value="4-5">4-5 meals/day</option>
                        <option value="6+">6+ meals/day</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentStep === 1
                      ? 'invisible'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md hover:shadow-lg'
                  }`}
                  disabled={currentStep === 1}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Next Step
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Assessment
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      
    </div>
  );
}

export default Assessment;