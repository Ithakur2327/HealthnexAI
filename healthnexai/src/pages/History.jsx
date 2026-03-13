import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { assessmentAPI } from '../services/api';

function History() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'grid'
  const [filterRisk, setFilterRisk] = useState('all'); // 'all', 'low', 'moderate', 'high'

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      console.log('🔄 Loading assessments...');
      const response = await assessmentAPI.getAll();
      console.log('📦 API Response:', response);
      
      let data = null;
      
      if (response.assessments && Array.isArray(response.assessments)) {
        data = response.assessments;
      } else if (Array.isArray(response)) {
        data = response;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      }
      
      console.log('📊 Assessments data:', data);
      
      if (data && data.length > 0) {
        setAssessments(data);
      }
    } catch (error) {
      console.error('❌ Failed to load assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (percentage) => {
    const num = Number(percentage);
    if (num < 30) return {
      bg: 'from-emerald-500 to-teal-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      label: 'Low Risk',
      ring: 'ring-emerald-500/20'
    };
    if (num < 60) return {
      bg: 'from-yellow-500 to-orange-500',
      text: 'text-yellow-600 dark:text-yellow-400',
      label: 'Moderate Risk',
      ring: 'ring-yellow-500/20'
    };
    return {
      bg: 'from-red-500 to-pink-500',
      text: 'text-red-600 dark:text-red-400',
      label: 'High Risk',
      ring: 'ring-red-500/20'
    };
  };

  const calculateOverallRisk = (riskScores) => {
    if (!riskScores) return 0;
    const risks = [
      riskScores.diabetesRisk || 0,
      riskScores.heartDiseaseRisk || 0,
      riskScores.bloodPressureRisk || 0,
      riskScores.obesityRisk || 0,
      riskScores.mentalHealthRisk || 0
    ];
    return Math.round(risks.reduce((a, b) => a + b, 0) / risks.length);
  };

  const getStats = () => {
    if (assessments.length === 0) return { total: 0, lowRisk: 0, moderateRisk: 0, highRisk: 0, avgRisk: 0 };
    
    let lowRisk = 0, moderateRisk = 0, highRisk = 0, totalRisk = 0;
    
    assessments.forEach(assessment => {
      const avgRisk = calculateOverallRisk(assessment.riskScores);
      totalRisk += avgRisk;
      
      if (avgRisk < 30) lowRisk++;
      else if (avgRisk < 60) moderateRisk++;
      else highRisk++;
    });
    
    return {
      total: assessments.length,
      lowRisk,
      moderateRisk,
      highRisk,
      avgRisk: Math.round(totalRisk / assessments.length)
    };
  };

  const getFilteredAssessments = () => {
    if (filterRisk === 'all') return assessments;
    
    return assessments.filter(assessment => {
      const avgRisk = calculateOverallRisk(assessment.riskScores);
      if (filterRisk === 'low') return avgRisk < 30;
      if (filterRisk === 'moderate') return avgRisk >= 30 && avgRisk < 60;
      if (filterRisk === 'high') return avgRisk >= 60;
      return true;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const stats = getStats();
  const filteredAssessments = getFilteredAssessments();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Hero Header with Stats */}
        <motion.div {...fadeIn} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Assessment History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your health journey over time
              </p>
            </div>
            <Link
              to="/assessment"
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Assessment
            </Link>
          </div>

          {/* Stats Cards */}
          {assessments.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total</span>
                  <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Avg Risk</span>
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgRisk}%</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Low Risk</span>
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lowRisk}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Moderate</span>
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.moderateRisk}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">High Risk</span>
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highRisk}</p>
              </motion.div>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-cyan-600 animate-spin mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 dark:text-gray-400">Loading history...</p>
            </div>
          </div>
        ) : assessments.length === 0 ? (
          <motion.div {...fadeIn} className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No Assessment History
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Start tracking your health by taking your first assessment
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
          </motion.div>
        ) : (
          <>
            {/* View Controls */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
            >
              {/* Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter:</span>
                {['all', 'low', 'moderate', 'high'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterRisk(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      filterRisk === filter
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    viewMode === 'timeline'
                      ? 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Grid
                </button>
              </div>
            </motion.div>

            {/* Timeline View */}
            <AnimatePresence mode="wait">
              {viewMode === 'timeline' ? (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="relative"
                >
                  {/* Timeline Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-teal-500 to-cyan-500 hidden md:block"></div>

                  <div className="space-y-6">
                    {filteredAssessments.map((assessment, index) => {
                      const overallRisk = calculateOverallRisk(assessment.riskScores);
                      const riskInfo = getRiskColor(overallRisk);
                      
                      return (
                        <motion.div
                          key={assessment._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative"
                        >
                          {/* Timeline Dot */}
                          <div className="hidden md:flex absolute left-8 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-900 rounded-full border-4 border-cyan-500 z-10"></div>

                          {/* Card */}
                          <div className="md:ml-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all group">
                            <div className="p-6">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                      {formatDate(assessment.createdAt)}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${riskInfo.text} bg-opacity-10 ${riskInfo.ring} ring-2`}>
                                      {riskInfo.label}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatTimeAgo(assessment.createdAt)}
                                  </p>
                                </div>
                                
                                {/* Overall Risk Score */}
                                <div className="flex flex-col items-center">
                                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${riskInfo.bg} flex items-center justify-center text-white shadow-lg`}>
                                    <div className="text-center">
                                      <p className="text-2xl font-bold">{overallRisk}</p>
                                      <p className="text-[10px] font-semibold opacity-90">AVG</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Risk Details Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                                {[
                                  { name: 'Diabetes', value: assessment.riskScores?.diabetesRisk || 0, icon: '🩺' },
                                  { name: 'Heart', value: assessment.riskScores?.heartDiseaseRisk || 0, icon: '❤️' },
                                  { name: 'BP', value: assessment.riskScores?.bloodPressureRisk || 0, icon: '💓' },
                                  { name: 'Obesity', value: assessment.riskScores?.obesityRisk || 0, icon: '⚖️' },
                                  { name: 'Mental', value: assessment.riskScores?.mentalHealthRisk || 0, icon: '🧠' }
                                ].map((risk) => {
                                  const riskColor = getRiskColor(risk.value);
                                  return (
                                    <div key={risk.name} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg">{risk.icon}</span>
                                        <span className={`text-sm font-bold ${riskColor.text}`}>{risk.value}%</span>
                                      </div>
                                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{risk.name}</p>
                                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                                        <div
                                          className={`h-full bg-gradient-to-r ${riskColor.bg} rounded-full transition-all duration-500`}
                                          style={{ width: `${risk.value}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Action Button */}
                              <Link
                                to="/results"
                                className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 hover:from-cyan-100 hover:to-teal-100 dark:hover:from-cyan-900/30 dark:hover:to-teal-900/30 text-cyan-700 dark:text-cyan-400 rounded-lg font-semibold text-sm transition-all group-hover:shadow-md"
                              >
                                <span>View Full Details</span>
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                /* Grid View */
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredAssessments.map((assessment, index) => {
                    const overallRisk = calculateOverallRisk(assessment.riskScores);
                    const riskInfo = getRiskColor(overallRisk);
                    
                    return (
                      <motion.div
                        key={assessment._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all group"
                      >
                        {/* Header with Gradient */}
                        <div className={`bg-gradient-to-r ${riskInfo.bg} p-6 text-white relative overflow-hidden`}>
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                          </div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold opacity-90">{formatTimeAgo(assessment.createdAt)}</span>
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                                {riskInfo.label}
                              </span>
                            </div>
                            <p className="text-lg font-bold mb-2">{formatDate(assessment.createdAt)}</p>
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-sm opacity-90">Average Risk</p>
                                <p className="text-4xl font-bold">{overallRisk}%</p>
                              </div>
                              <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="space-y-3">
                            {[
                              { name: 'Diabetes', value: assessment.riskScores?.diabetesRisk || 0, icon: '🩺' },
                              { name: 'Heart Disease', value: assessment.riskScores?.heartDiseaseRisk || 0, icon: '❤️' },
                              { name: 'Blood Pressure', value: assessment.riskScores?.bloodPressureRisk || 0, icon: '💓' },
                              { name: 'Obesity', value: assessment.riskScores?.obesityRisk || 0, icon: '⚖️' },
                              { name: 'Mental Health', value: assessment.riskScores?.mentalHealthRisk || 0, icon: '🧠' }
                            ].map((risk) => {
                              const riskColor = getRiskColor(risk.value);
                              return (
                                <div key={risk.name} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{risk.icon}</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{risk.name}</span>
                                  </div>
                                  <span className={`text-sm font-bold ${riskColor.text}`}>{risk.value}%</span>
                                </div>
                              );
                            })}
                          </div>

                          <Link
                            to="/results"
                            className="mt-6 flex items-center justify-center w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm transition-all"
                          >
                            <span>View Details</span>
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* No Results Message */}
            {filteredAssessments.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  No assessments found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your filter to see more results
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default History;