import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSaveProfile = () => {
    console.log('Saving:', formData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = () => {
    console.log('Changing password');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      console.log('Deleting account');
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.trim().split(' ');
    if (names.length >= 2) return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    return user.name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = () => {
    const colors = [
      'from-cyan-500 to-teal-500',
      'from-blue-500 to-cyan-500',
      'from-teal-500 to-emerald-500',
      'from-indigo-500 to-blue-500',
      'from-purple-500 to-indigo-500',
    ];
    return colors[(user?.name?.charCodeAt(0) || 0) % colors.length];
  };

  const tabs = [
    { id: 'profile',  label: 'Profile'  },
    { id: 'password', label: 'Password' },
    { id: 'danger',   label: 'Account'  },
  ];

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50
    border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500
    focus:border-transparent disabled:opacity-50 transition-all duration-150`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="flex-grow flex flex-col items-center px-4 py-12">

        {/* Avatar + Name */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center mb-8"
        >
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getAvatarColor()}
            flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4`}>
            {getUserInitials()}
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-200/70 dark:bg-gray-800 rounded-xl mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setIsEditing(false); }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 shadow-sm ' +
                    (tab.id === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white')
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Card */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-sm
            border border-gray-100 dark:border-gray-700 p-8"
        >

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-sm font-semibold text-cyan-600 dark:text-cyan-400
                    hover:text-cyan-700 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider
                    text-gray-400 mb-1.5">Full Name</label>
                  <input
                    type="text" name="name" value={formData.name}
                    onChange={handleChange} disabled={!isEditing}
                    placeholder="Your name" className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider
                    text-gray-400 mb-1.5">Email</label>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} disabled={!isEditing}
                    placeholder="you@example.com" className={inputClass}
                  />
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600
                    hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-sm
                    font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {saved ? '✓ Saved' : 'Save Changes'}
                </button>
              )}
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>
              <div className="space-y-4">
                {[
                  { label: 'Current Password', name: 'currentPassword' },
                  { label: 'New Password',      name: 'newPassword'     },
                  { label: 'Confirm Password',  name: 'confirmPassword' },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold uppercase tracking-wider
                      text-gray-400 mb-1.5">{label}</label>
                    <input
                      type="password" name={name} value={passwordData[name]}
                      onChange={handlePasswordChange} placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleChangePassword}
                className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600
                  hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-sm
                  font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Update Password
              </button>
            </div>
          )}

          {/* Danger Tab */}
          {activeTab === 'danger' && (
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white mb-2">Delete Account</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                All your data — assessments, history, and chats — will be permanently removed.
                This action cannot be undone.
              </p>
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20
                border border-red-100 dark:border-red-800/50 mb-6">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  ⚠️ Permanent deletion — no recovery possible.
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl
                  text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Delete My Account
              </button>
            </div>
          )}

        </motion.div>
      </main>

      
    </div>
  );
}

export default Profile;
