import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Palette, Bell, Lock } from 'lucide-react';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';
import { useThemeStore } from '../store/themeStore';

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="text-primary-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your application preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="text-primary-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Appearance
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Theme</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-primary-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Browser Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status: {notificationPermission === 'granted' ? 'Enabled ✓' : notificationPermission === 'denied' ? 'Blocked ✗' : 'Not enabled'}
                </p>
              </div>
              {notificationPermission !== 'granted' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={requestNotificationPermission}
                >
                  Enable
                </Button>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enable browser notifications to stay updated about task changes, assignments, and board activity.
            </p>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="text-primary-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Security
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">Password</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your password is secure</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">Account Security</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your account is protected with JWT authentication</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
