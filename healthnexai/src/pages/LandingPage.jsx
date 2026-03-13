import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const { isAuthenticated } = useAuth();
  
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow">
        
        {/* Hero Section - With Feature Badges */}
        <section className="relative overflow-hidden pt-1 sm:pt-4 md:pt-8 pb-6 sm:pb-10 md:pb-14 px-4 sm:px-6 min-h-[calc(100vh-64px)] flex items-center bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
          
          {/* Simple Background - Only Dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Subtle Gradient Orbs */}
            <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
            
            {/* Minimal Dots */}
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-500 dark:bg-cyan-400 rounded-full opacity-[0.08] dark:opacity-[0.05]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${15 + Math.random() * 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="max-w-5xl">
              
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="space-y-4 sm:space-y-6"
              >
                {/* Badge */}
                <motion.div variants={fadeInUp}>
                  <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-500/10 dark:bg-cyan-500/20 border-2 border-cyan-500/30 rounded-full text-xs sm:text-sm font-semibold text-cyan-700 dark:text-cyan-300 backdrop-blur-sm">
                    AI-Powered Health Platform
                  </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1 
                  variants={fadeInUp}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                >
                  <span className="block text-gray-900 dark:text-white mb-2">
                    Your Health,
                  </span>
                  <span className="block bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                    Predicted & Protected
                  </span>
                </motion.h1>

                {/* Description */}
                <motion.p 
                  variants={fadeInUp}
                  className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl"
                >
                  Harness the power of artificial intelligence to predict health risks, 
                  receive personalized lifestyle recommendations, and take control of your 
                  wellness journey before diseases develop.
                </motion.p>

                {/* Feature Badges */}
                <motion.div 
                  variants={fadeInUp}
                  className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
                >
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">Instant AI Analysis</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">5 Major Health Risks</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">100% Private & Secure</span>
                  </div>
                </motion.div>

                {/* Buttons - Conditional based on authentication */}
                <motion.div 
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
                >
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/assessment"
                        className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300"
                      >
                        <span>Take Assessment</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>

                      <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white border-2 border-gray-300 dark:border-white/20 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-white/10 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300"
                      >
                        View Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300"
                      >
                        <span>Get Started Free</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>

                      <a
                        href="#features"
                        className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white border-2 border-gray-300 dark:border-white/20 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-white/10 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300"
                      >
                        Learn More
                      </a>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-16 md:py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-12 sm:mb-16"
            >
              <motion.span variants={fadeInUp} className="text-cyan-600 dark:text-cyan-400 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                Features
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-3 sm:mb-4 px-4">
                Everything You Need for Better Health
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                Comprehensive AI-powered tools designed to revolutionize your approach to preventive healthcare
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
            >
              {[
                {
                  icon: <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                  title: 'AI Risk Assessment',
                  description: 'Advanced machine learning algorithms analyze your lifestyle and habits to predict disease risks with high accuracy.',
                  gradient: 'from-cyan-500 to-teal-500'
                },
                {
                  icon: <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                  title: 'NexAI Assistant',
                  description: 'Your personal health companion powered by AI. Get instant answers, recommendations, and support anytime.',
                  gradient: 'from-teal-500 to-cyan-500'
                },
                {
                  icon: <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
                  title: 'Smart Dashboard',
                  description: 'Visualize your health metrics, track progress, and monitor risk levels through an intuitive interface.',
                  gradient: 'from-cyan-500 to-teal-500'
                },
                {
                  icon: <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
                  title: 'Multi-Disease Analysis',
                  description: 'Simultaneous screening for diabetes, heart disease, blood pressure, obesity, and mental health.',
                  gradient: 'from-teal-500 to-emerald-500'
                },
                {
                  icon: <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
                  title: 'Personalized Plans',
                  description: 'Receive custom lifestyle recommendations, diet plans, and exercise routines tailored to your profile.',
                  gradient: 'from-cyan-500 to-teal-500'
                },
                {
                  icon: <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
                  title: 'Privacy First',
                  description: 'Bank-level encryption ensures your health data remains completely secure and private at all times.',
                  gradient: 'from-teal-500 to-cyan-500'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -6 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-12 sm:mb-16"
            >
              <motion.span variants={fadeInUp} className="text-cyan-600 dark:text-cyan-400 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                How It Works
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-3 sm:mb-4 px-4">
                Get Started in 3 Simple Steps
              </motion.h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              {[
                {
                  step: '01',
                  title: 'Create Your Profile',
                  description: 'Sign up in seconds and complete a comprehensive lifestyle assessment covering your habits and health goals.',
                  icon: <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                },
                {
                  step: '02',
                  title: 'AI Analysis',
                  description: 'Our advanced machine learning models process your data and generate personalized risk predictions.',
                  icon: <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                },
                {
                  step: '03',
                  title: 'Take Action',
                  description: 'Receive custom recommendations, track your progress, and chat with NexAI for ongoing health guidance.',
                  icon: <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="relative text-center"
                >
                  <div className="relative inline-block mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-xs sm:text-sm shadow-lg border-2 border-cyan-500">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 px-4">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed px-4">
                    {step.description}
                  </p>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 sm:top-10 left-1/2 w-full h-px bg-gradient-to-r from-cyan-300 to-teal-300 dark:from-cyan-700 dark:to-teal-700"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Health Coverage */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-gray-800/50 dark:to-gray-800/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-8 sm:mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
                Comprehensive Health Coverage
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-4">
                AI-powered risk prediction for the most common chronic diseases
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
            >
              {[
                { name: 'Diabetes', icon: '🩺', color: 'from-red-500 to-orange-500' },
                { name: 'Heart Disease', icon: '❤️', color: 'from-orange-500 to-red-500' },
                { name: 'Blood Pressure', icon: '💓', color: 'from-yellow-500 to-orange-500' },
                { name: 'Obesity', icon: '⚖️', color: 'from-emerald-500 to-teal-500' },
                { name: 'Mental Health', icon: '🧠', color: 'from-cyan-500 to-teal-500' }
              ].map((disease, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -6 }}
                  className={`bg-gradient-to-br ${disease.color} p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl text-white text-center transition-all duration-300`}
                >
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{disease.icon}</div>
                  <div className="font-semibold text-xs sm:text-sm md:text-base">{disease.name}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-700 dark:to-teal-700">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
                Ready to Take Control of Your Health?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-cyan-50 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Join thousands of users who are already using AI to prevent diseases and live healthier lives.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-cyan-600 rounded-xl font-bold text-sm sm:text-base md:text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
              >
                <span>Start Your Free Assessment Now</span>
                <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;