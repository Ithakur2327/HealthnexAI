import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { assessmentAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

function Results() {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [allAssessments, setAllAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading results...');
      const response = await assessmentAPI.getAll();
      console.log('📦 API Response:', response);
      
      let assessments = null;
      
      // Handle different response structures
      if (response.assessments && Array.isArray(response.assessments)) {
        assessments = response.assessments;
      } else if (Array.isArray(response)) {
        assessments = response;
      } else if (response.data && Array.isArray(response.data)) {
        assessments = response.data;
      }
      
      console.log('📊 Assessments:', assessments);
      
      if (assessments && assessments.length > 0) {
        setAllAssessments(assessments);
        setCurrentAssessment(assessments[0]);
        console.log('✅ Current assessment:', assessments[0]);
        console.log('✅ Risk scores:', assessments[0].riskScores);
      } else {
        console.log('❌ No assessments found');
      }
    } catch (error) {
      console.error('❌ Failed to load results:', error);
      toast.error('Failed to load results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallScore = () => {
    if (!currentAssessment?.riskScores) {
      console.log('⚠️ No riskScores found');
      return 0;
    }
    
    const risks = [
      currentAssessment.riskScores.diabetesRisk || 0,
      currentAssessment.riskScores.heartDiseaseRisk || 0,
      currentAssessment.riskScores.bloodPressureRisk || 0,
      currentAssessment.riskScores.obesityRisk || 0,
      currentAssessment.riskScores.mentalHealthRisk || 0
    ];
    
    const avgRisk = risks.reduce((a, b) => a + b, 0) / risks.length;
    const score = Math.round(100 - avgRisk);
    console.log('📈 Overall score:', score);
    return score;
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return { 
      label: 'Excellent', 
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'from-emerald-500 to-teal-500',
      message: 'Your health metrics are excellent! Keep up the great work.',
      emoji: '🎉'
    };
    if (score >= 60) return { 
      label: 'Good', 
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'from-yellow-500 to-orange-500',
      message: 'Your health is generally good, but there\'s room for improvement.',
      emoji: '👍'
    };
    return { 
      label: 'Needs Attention', 
      color: 'text-red-600 dark:text-red-400',
      bg: 'from-red-500 to-pink-500',
      message: 'Your health needs attention. Follow our recommendations carefully.',
      emoji: '⚠️'
    };
  };

  const getRiskLevel = (value) => {
    if (value < 30) return { 
      label: 'Low Risk', 
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      barColor: 'from-emerald-500 to-teal-500'
    };
    if (value < 60) return { 
      label: 'Moderate Risk', 
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      barColor: 'from-yellow-500 to-orange-500'
    };
    return { 
      label: 'High Risk', 
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      borderColor: 'border-red-200 dark:border-red-800',
      barColor: 'from-red-500 to-pink-500'
    };
  };

  const getTrend = (metric) => {
    if (allAssessments.length < 2) return null;
    const currentIndex = allAssessments.findIndex(a => a._id === currentAssessment._id);
    if (currentIndex === -1 || currentIndex === allAssessments.length - 1) return null;
    
    const current = currentAssessment.riskScores?.[metric] || 0;
    const previous = allAssessments[currentIndex + 1].riskScores?.[metric] || 0;
    const change = previous - current;
    
    return {
      value: Math.abs(change),
      improved: change > 0,
      percentage: change
    };
  };

  const getRiskDetails = () => {
    if (!currentAssessment?.riskScores) {
      console.log('⚠️ No riskScores in getRiskDetails');
      return [];
    }
    
    const scores = currentAssessment.riskScores;
    console.log('📊 Building risk details from:', scores);
    
    return [
      {
        name: 'Diabetes',
        icon: '🩺',
        value: scores.diabetesRisk || 0,
        color: 'from-red-500 to-orange-500',
        description: 'Risk of developing type 2 diabetes based on your lifestyle and health metrics.',
        recommendations: [
          'Monitor blood sugar levels regularly',
          'Maintain a balanced diet low in refined sugars',
          'Exercise for at least 30 minutes daily',
          'Keep a healthy weight (BMI 18.5-24.9)',
          'Get regular health checkups'
        ],
        warning: (scores.diabetesRisk || 0) >= 60 ? 'High risk detected. Please consult a healthcare provider.' : null
      },
      {
        name: 'Heart Disease',
        icon: '❤️',
        value: scores.heartDiseaseRisk || 0,
        color: 'from-orange-500 to-red-500',
        description: 'Risk of cardiovascular disease based on your health indicators.',
        recommendations: [
          'Reduce sodium intake in your diet',
          'Include more omega-3 fatty acids (fish, nuts)',
          'Manage stress through meditation or yoga',
          'Avoid smoking and limit alcohol consumption',
          'Regular cardiovascular exercise'
        ],
        warning: (scores.heartDiseaseRisk || 0) >= 60 ? 'Elevated heart disease risk. Medical consultation recommended.' : null
      },
      {
        name: 'Blood Pressure',
        icon: '💓',
        value: scores.bloodPressureRisk || 0,
        color: 'from-yellow-500 to-orange-500',
        description: 'Risk of hypertension based on your lifestyle factors.',
        recommendations: [
          'Reduce salt intake to less than 5g per day',
          'Increase potassium-rich foods (bananas, spinach)',
          'Maintain regular exercise routine',
          'Practice stress management techniques',
          'Monitor blood pressure weekly'
        ],
        warning: (scores.bloodPressureRisk || 0) >= 60 ? 'Blood pressure risk is high. Please monitor regularly.' : null
      },
      {
        name: 'Obesity',
        icon: '⚖️',
        value: scores.obesityRisk || 0,
        color: 'from-emerald-500 to-teal-500',
        description: 'Risk assessment based on BMI and lifestyle factors.',
        recommendations: [
          'Set realistic weight loss goals (0.5-1 kg per week)',
          'Focus on whole foods and portion control',
          'Increase physical activity gradually',
          'Track your food intake and calories',
          'Stay hydrated (8 glasses of water daily)'
        ],
        warning: (scores.obesityRisk || 0) >= 60 ? 'Weight management attention needed. Consider nutritionist consultation.' : null
      },
      {
        name: 'Mental Health',
        icon: '🧠',
        value: scores.mentalHealthRisk || 0,
        color: 'from-cyan-500 to-blue-500',
        description: 'Mental health risk based on stress levels and lifestyle.',
        recommendations: [
          'Practice mindfulness and meditation daily',
          'Ensure 7-9 hours of quality sleep',
          'Connect with friends and family regularly',
          'Limit screen time before bedtime',
          'Consider professional counseling if needed'
        ],
        warning: (scores.mentalHealthRisk || 0) >= 60 ? 'Mental health support may be beneficial. Consider speaking with a professional.' : null
      }
    ];
  };

  const handleDownloadPDF = () => {
    toast.info('PDF download feature coming soon!');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
    setShowShareModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-cyan-600 animate-spin mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">Loading your results...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No Assessment Results
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You haven't completed any health assessments yet. Take one now to get personalized insights!
            </p>
            <Link
              to="/assessment"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <span>Take Assessment</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const overallScore = calculateOverallScore();
  const scoreInfo = getScoreLabel(overallScore);
  const riskDetails = getRiskDetails();

  console.log('🎯 Rendering with:', { overallScore, riskDetails });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Assessment Results
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Completed on {formatDate(currentAssessment.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </motion.div>

        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`bg-gradient-to-br ${scoreInfo.bg} rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-5xl">{scoreInfo.emoji}</span>
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">Overall Health Score</p>
                    <h2 className="text-6xl font-bold">{overallScore}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-block px-4 py-2 rounded-full text-base font-bold bg-white/20 backdrop-blur-sm">
                    {scoreInfo.label}
                  </span>
                  {allAssessments.length > 1 && (
                    <Link
                      to="/history"
                      className="inline-flex items-center text-sm font-semibold text-white/80 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View History
                    </Link>
                  )}
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-white/90 text-base leading-relaxed max-w-md">
                  {scoreInfo.message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Risk Details */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Detailed Risk Analysis
          </h2>

          {riskDetails.map((risk, index) => {
            const riskLevel = getRiskLevel(risk.value);
            const trend = getTrend(`${risk.name.toLowerCase().replace(' ', '')}Risk`);
            
            return (
              <motion.div
                key={risk.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Header */}
                <div className={`p-6 border-b-2 ${riskLevel.borderColor}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${risk.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                        {risk.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {risk.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {risk.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                        {risk.value}%
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${riskLevel.bgColor} ${riskLevel.color}`}>
                        {riskLevel.label}
                      </span>
                      {trend && (
                        <div className={`mt-2 flex items-center justify-end text-sm font-semibold ${trend.improved ? 'text-emerald-600' : 'text-red-600'}`}>
                          {trend.improved ? '↓' : '↑'} {trend.value}% from last assessment
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      <span>0%</span>
                      <span>Low Risk</span>
                      <span>Moderate Risk</span>
                      <span>High Risk</span>
                      <span>100%</span>
                    </div>
                    <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${risk.value}%` }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${riskLevel.barColor} rounded-full relative`}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Warning Alert */}
                {risk.warning && (
                  <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-bold text-red-800 dark:text-red-300 mb-1">
                          ⚠️ Medical Attention Recommended
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-400">
                          {risk.warning}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Personalized Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {risk.recommendations.map((rec, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (index * 0.1) + (idx * 0.05), duration: 0.3 }}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                          <span className="text-white text-xs font-bold">{idx + 1}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {rec}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg border border-cyan-200 dark:border-gray-700 p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            What's Next?
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/assessment"
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl hover:shadow-xl transition-all group border-2 border-transparent hover:border-cyan-500"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Take New Assessment</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Track your progress with another assessment
              </p>
            </Link>

            <Link
              to="/nexai"
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl hover:shadow-xl transition-all group border-2 border-transparent hover:border-purple-500"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ask NexAI</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Get personalized health advice from our AI
              </p>
            </Link>

            <Link
              to="/history"
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl hover:shadow-xl transition-all group border-2 border-transparent hover:border-emerald-500"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">View History</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Compare with your past assessments
              </p>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Results</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => copyToClipboard(window.location.href)}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-all"
                >
                  <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Copy Link</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Share via clipboard</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    window.open(`https://wa.me/?text=Check out my health assessment results!`, '_blank');
                    setShowShareModal(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-all"
                >
                  <div className="w-6 h-6 text-green-600">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">WhatsApp</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Share on WhatsApp</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    window.open(`mailto:?subject=My Health Assessment Results&body=Check out my health assessment results!`, '_blank');
                    setShowShareModal(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-all"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Share via email</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default Results;