import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function Toast({ message, type = 'info', onClose }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 4000;
    const interval = 50;
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const config = {
    success: {
      bg: 'from-emerald-500 to-teal-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      progressBg: 'bg-emerald-300'
    },
    error: {
      bg: 'from-red-500 to-pink-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      progressBg: 'bg-red-300'
    },
    warning: {
      bg: 'from-yellow-500 to-orange-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      progressBg: 'bg-yellow-300'
    },
    info: {
      bg: 'from-cyan-500 to-blue-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      progressBg: 'bg-cyan-300'
    }
  };

  const currentConfig = config[type] || config.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="pointer-events-auto min-w-[320px] max-w-md"
    >
      <div className={`bg-gradient-to-r ${currentConfig.bg} rounded-xl shadow-2xl overflow-hidden`}>
        <div className="p-4 flex items-start gap-3">
          <div className="flex-shrink-0 text-white">
            {currentConfig.icon}
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-white font-medium text-sm leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1 -mr-1 -mt-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-white/20">
          <motion.div
            className={`h-full ${currentConfig.progressBg}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.05, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Toast;