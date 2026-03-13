import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { assessmentAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

function Dashboard() {
  const toast = useToast();
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [allAssessments, setAllAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

 const loadAssessments = async () => {
  setLoading(true);
  try {
    const response = await assessmentAPI.getAll();
    let assessments = null;
    
    if (response.assessments && Array.isArray(response.assessments)) {
      assessments = response.assessments;
    } else if (Array.isArray(response)) {
      assessments = response;
    } else if (response.data && Array.isArray(response.data)) {
      assessments = response.data;
    }
    
    if (assessments && assessments.length > 0) {
      setAllAssessments(assessments);
      setSelectedAssessment(assessments[0]);
    }
  } catch (error) {
    console.error('Failed to load assessment:', error);
    // Don't show error toast if user is not authenticated (401)
    if (error.response?.status !== 401) {
      toast.error('Failed to load assessments. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  const handleSelectAssessment = (assessment) => {
    setSelectedAssessment(assessment);
  };

  const calculateOverallScore = () => {
    if (!selectedAssessment?.results) return 0;
    const risks = [
      selectedAssessment.results.diabetesRisk,
      selectedAssessment.results.heartDiseaseRisk,
      selectedAssessment.results.bloodPressureRisk,
      selectedAssessment.results.obesityRisk,
      selectedAssessment.results.mentalHealthRisk
    ];
    const avgRisk = risks.reduce((a, b) => a + b, 0) / risks.length;
    return Math.round(100 - avgRisk);
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400', bg: 'from-emerald-500 to-teal-500' };
    if (score >= 60) return { label: 'Good', color: 'text-yellow-600 dark:text-yellow-400', bg: 'from-yellow-500 to-orange-500' };
    return { label: 'Needs Attention', color: 'text-red-600 dark:text-red-400', bg: 'from-red-500 to-pink-500' };
  };

  const getRiskLevel = (value) => {
    if (value < 30) return { label: 'Low Risk', color: 'text-emerald-600 dark:text-emerald-400' };
    if (value < 60) return { label: 'Moderate Risk', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'High Risk', color: 'text-red-600 dark:text-red-400' };
  };

  const getRiskData = () => {
    if (!selectedAssessment?.results) return [];
    return [
      { 
        name: 'Diabetes', 
        value: selectedAssessment.results.diabetesRisk, 
        color: 'from-red-500 to-orange-500',
        icon: '🩺',
        trend: getTrend('diabetesRisk')
      },
      { 
        name: 'Heart Disease', 
        value: selectedAssessment.results.heartDiseaseRisk, 
        color: 'from-orange-500 to-yellow-500',
        icon: '❤️',
        trend: getTrend('heartDiseaseRisk')
      },
      { 
        name: 'Blood Pressure', 
        value: selectedAssessment.results.bloodPressureRisk, 
        color: 'from-yellow-500 to-green-500',
        icon: '💓',
        trend: getTrend('bloodPressureRisk')
      },
      { 
        name: 'Obesity', 
        value: selectedAssessment.results.obesityRisk, 
        color: 'from-emerald-500 to-teal-500',
        icon: '⚖️',
        trend: getTrend('obesityRisk')
      },
      { 
        name: 'Mental Health', 
        value: selectedAssessment.results.mentalHealthRisk, 
        color: 'from-cyan-500 to-teal-500',
        icon: '🧠',
        trend: getTrend('mentalHealthRisk')
      }
    ];
  };

  const getTrend = (metric) => {
    const currentIndex = allAssessments.findIndex(a => a._id === selectedAssessment._id);
    if (currentIndex === -1 || currentIndex === allAssessments.length - 1) return 0;
    
    const current = selectedAssessment.results?.[metric] || 0;
    const previous = allAssessments[currentIndex + 1].results?.[metric] || 0;
    return previous - current;
  };

  const getHealthInsights = () => {
    if (!selectedAssessment?.results) return [];
    const risks = getRiskData();
    const insights = [];

    const highRisks = risks.filter(r => r.value >= 60);
    if (highRisks.length > 0) {
      insights.push({
        type: 'warning',
        title: 'High Risk Areas Detected',
        message: `You have ${highRisks.length} high-risk categories. Consider consulting a healthcare professional.`,
        icon: '⚠️',
        color: 'border-red-500 bg-red-50 dark:bg-red-900/20'
      });
    }

    const improvements = risks.filter(r => r.trend > 2);
    if (improvements.length > 0) {
      insights.push({
        type: 'success',
        title: 'Great Progress!',
        message: `You've improved in ${improvements.length} health categories. Keep up the good work!`,
        icon: '🎉',
        color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
      });
    }

    if (allAssessments.length > 0) {
      const lastAssessment = new Date(allAssessments[0].createdAt);
      const daysSince = Math.floor((new Date() - lastAssessment) / (1000 * 60 * 60 * 24));
      if (daysSince >= 30) {
        insights.push({
          type: 'info',
          title: 'Time for a Checkup',
          message: `It's been ${daysSince} days since your last assessment. Regular monitoring is key to health.`,
          icon: '📋',
          color: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
        });
      }
    }

    return insights;
  };

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRecentActivity = () => {
    return allAssessments.slice(0, 3).map((assessment, index) => ({
      id: assessment._id,
      assessment: assessment,
      date: new Date(assessment.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short', 
        day: 'numeric' 
      }),
      score: assessment.results?.overallScore || 0,
      isSelected: selectedAssessment?._id === assessment._id
    }));
  };

  const overallScore = calculateOverallScore();
  const scoreInfo = getScoreLabel(overallScore);
  const healthInsights = getHealthInsights();
  const recentActivity = getRecentActivity();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Header */}
        <motion.div {...fadeInUp} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Health Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's your health overview
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-cyan-600 animate-spin mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        ) : !selectedAssessment ? (
          <motion.div {...fadeInUp} className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Start Your Health Journey
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Take your first health assessment to get personalized insights and start tracking your wellness journey.
              </p>
              <Link
                to="/assessment"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <span>Start Assessment</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Overall Health Score - Large Card */}
              <motion.div
                key={selectedAssessment._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="md:col-span-2 bg-gradient-to-br from-cyan-500 via-teal-500 to-cyan-500 dark:from-cyan-600 dark:via-teal-600 dark:to-cyan-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-cyan-100 text-sm font-medium mb-1">Overall Health Score</p>
                      <h3 className="text-5xl font-bold mb-2">{overallScore}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold bg-white/20`}>
                        {scoreInfo.label}
                      </span>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-cyan-100 text-xs mb-1">Total Assessments</p>
                      <p className="text-2xl font-bold">{allAssessments.length}</p>
                    </div>
                    <div>
                      <p className="text-cyan-100 text-xs mb-1">Assessment Date</p>
                      <p className="text-sm font-semibold">
                        {formatFullDate(selectedAssessment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Low Risk</h4>
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {getRiskData().filter(r => r.value < 30).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Needs Focus</h4>
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {getRiskData().filter(r => r.value >= 60).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
              </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Risk Categories - 2 columns */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Risk Categories</h3>
                
                {getRiskData().map((risk, index) => {
                  const riskLevel = getRiskLevel(risk.value);
                  return (
                    <motion.div
                      key={`${selectedAssessment._id}-${risk.name}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${risk.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                            {risk.icon}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{risk.name}</h4>
                            <p className={`text-sm font-semibold ${riskLevel.color}`}>
                              {riskLevel.label}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">{risk.value}%</p>
                          {risk.trend !== 0 && (
                            <span className={`text-sm font-semibold flex items-center justify-end ${risk.trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {risk.trend > 0 ? '↓' : '↑'} {Math.abs(risk.trend)}%
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${risk.value}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${risk.color} rounded-full`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Sidebar - Recent Activity & Actions */}
                 <div className="space-y-6 lg:mt-11">
                
                {/* Recent Activity - Clickable on Same Page */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <button
                        key={activity.id}
                        onClick={() => handleSelectAssessment(activity.assessment)}
                        className={`w-full text-left p-3 rounded-lg transition-all group cursor-pointer ${
                          activity.isSelected
                            ? 'bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border-2 border-cyan-200 dark:border-cyan-800' 
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${activity.isSelected ? 'bg-cyan-600 animate-pulse' : 'bg-gray-400'}`}></div>
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                {activity.date}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {activity.isSelected ? 'Viewing' : 'Click to view'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {activity.score}
                            </span>
                            {!activity.isSelected && (
                              <svg className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <Link
                    to="/history"
                    className="block mt-4 text-center text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                  >
                    View All History →
                  </Link>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <Link
                      to="/assessment"
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 rounded-lg text-white transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-semibold">New Assessment</span>
                      </div>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    <Link
                      to="/nexai"
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Ask NexAI</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    <Link
                      to="/results"
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">View Full Results</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>

                {/* Health Tip */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 p-6"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">Health Tip of the Day</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Regular health assessments help you stay on top of potential risks. Try to complete one every 30 days for optimal tracking.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;