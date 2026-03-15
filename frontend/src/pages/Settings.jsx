import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Palette, Bell, Lock, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';
import { useThemeStore } from '../store/themeStore';
import { motion } from 'framer-motion';

const Settings = () => {
  const { theme } = useThemeStore();
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        new Notification('Notifications Enabled!', {
          body: 'You will now receive notifications from TaskCollab',
          icon: '/vite.svg',
        });
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-primary-50 dark:bg-primary-500/10 rounded-xl text-primary-500">
            <SettingsIcon size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-white tracking-tight">
              Settings
            </h1>
            <p className="text-secondary-500 dark:text-secondary-400 mt-1">
              Manage your application preferences and security
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        {/* Appearance */}
        <motion.section variants={itemVariants} className="bg-white dark:bg-[#1A1A1D] rounded-2xl p-8 shadow-sm border border-secondary-200/60 dark:border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-400 to-primary-600" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary-50 dark:bg-white/5 rounded-lg text-secondary-600 dark:text-secondary-300">
                <Palette size={20} />
            </div>
            <div>
                <h2 className="text-xl font-display font-bold text-secondary-900 dark:text-white">
                Appearance
                </h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Customize how the application looks to you.</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary-50/50 dark:bg-black/20 rounded-xl border border-secondary-100 dark:border-white/5">
            <div>
              <p className="font-semibold text-secondary-900 dark:text-white">Theme</p>
              <p className="text-[13px] text-secondary-500 dark:text-secondary-400 mt-0.5">
                Current: <span className="font-medium text-secondary-700 dark:text-secondary-300">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </p>
            </div>
            <ThemeToggle />
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section variants={itemVariants} className="bg-white dark:bg-[#1A1A1D] rounded-2xl p-8 shadow-sm border border-secondary-200/60 dark:border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-600" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary-50 dark:bg-white/5 rounded-lg text-secondary-600 dark:text-secondary-300">
                <Bell size={20} />
            </div>
            <div>
                <h2 className="text-xl font-display font-bold text-secondary-900 dark:text-white">
                Notifications
                </h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Control how you receive alerts.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-secondary-50/50 dark:bg-black/20 rounded-xl border border-secondary-100 dark:border-white/5">
              <div>
                <p className="font-semibold text-secondary-900 dark:text-white">Browser Notifications</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="relative flex h-2 w-2">
                        {notificationPermission === 'granted' && <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></>}
                        {notificationPermission === 'denied' && <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>}
                        {notificationPermission === 'default' && <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>}
                    </span>
                    <p className="text-[13px] text-secondary-500 dark:text-secondary-400">
                    Status: <span className="font-medium text-secondary-700 dark:text-secondary-300">{notificationPermission === 'granted' ? 'Enabled' : notificationPermission === 'denied' ? 'Blocked' : 'Action Required'}</span>
                    </p>
                </div>
              </div>
              {notificationPermission !== 'granted' && (
                <Button
                  variant={notificationPermission === 'denied' ? 'outline' : 'primary'}
                  size="sm"
                  onClick={requestNotificationPermission}
                  disabled={notificationPermission === 'denied'}
                  className="shadow-sm"
                >
                  {notificationPermission === 'denied' ? 'Unblock in Browser' : 'Enable Setup'}
                </Button>
              )}
            </div>

            <p className="text-[13px] text-secondary-400 dark:text-secondary-500 italic pl-1">
              * Enable browser notifications to stay updated about task changes, assignments, and active board mentions.
            </p>
          </div>
        </motion.section>

        {/* Security */}
        <motion.section variants={itemVariants} className="bg-white dark:bg-[#1A1A1D] rounded-2xl p-8 shadow-sm border border-secondary-200/60 dark:border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-green-600" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary-50 dark:bg-white/5 rounded-lg text-secondary-600 dark:text-secondary-300">
                <Lock size={20} />
            </div>
            <div>
                <h2 className="text-xl font-display font-bold text-secondary-900 dark:text-white">
                Security
                </h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Manage account security and protection.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-secondary-50/50 dark:bg-black/20 rounded-xl border border-secondary-100 dark:border-white/5 flex gap-4 items-start">
               <div className="p-2 bg-white dark:bg-white/5 rounded-lg text-secondary-500">
                   <ShieldCheck size={20} className="text-green-500" />
               </div>
               <div>
                <p className="font-semibold text-secondary-900 dark:text-white mb-1">Password</p>
                <p className="text-[13px] text-secondary-500 dark:text-secondary-400">Your password is securely hashed and protected. Contact support for resets.</p>
               </div>
            </div>

            <div className="p-5 bg-secondary-50/50 dark:bg-black/20 rounded-xl border border-secondary-100 dark:border-white/5 flex gap-4 items-start">
                <div className="p-2 bg-white dark:bg-white/5 rounded-lg text-secondary-500">
                   <Lock size={20} className="text-primary-500" />
               </div>
               <div>
                <p className="font-semibold text-secondary-900 dark:text-white mb-1">Account Security</p>
                <p className="text-[13px] text-secondary-500 dark:text-secondary-400">Your sessions are protected via strict JWT authentication policies.</p>
               </div>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default Settings;
