import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Content */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 group w-fit">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg opacity-60 blur-sm group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-9 h-9 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <span className="text-base font-extrabold bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                HealthnexAI
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              AI-powered health risk forecasting to help you make smarter lifestyle decisions.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-2">
              {[
                {
                  label: 'Facebook',
                  path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
                },
                {
                  label: 'Twitter',
                  path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'
                },
                {
                  label: 'LinkedIn',
                  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
                },
              ].map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-teal-500 hover:text-white transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
              Navigate
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/nexai', label: 'NexAI Assistant' },
                { to: '/assessment', label: 'Health Assessment' },
                { to: '/history', label: 'History' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-150 flex items-center space-x-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-cyan-500 transition-colors duration-150"></span>
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {[
                'Privacy Policy',
                'Terms of Service',
                'FAQ',
                'Contact Support',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-150 flex items-center space-x-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-cyan-500 transition-colors duration-150"></span>
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-5 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {currentYear} HealthnexAI. All rights reserved.
          </p>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-gray-400 dark:text-gray-500">All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
