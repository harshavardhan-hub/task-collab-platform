import React, { useEffect, useState } from 'react';
import { Activity as ActivityIcon, RefreshCw } from 'lucide-react';
import ActivityItem from '../components/activity/ActivityItem';
import { activityAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/common/Toast';
import { motion } from 'framer-motion';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, removeToast, error } = useToast();

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getRecentActivity(50);
      setActivities(response.data.activities);
    } catch (err) {
      error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-50 dark:bg-primary-500/10 rounded-xl text-primary-500">
            <ActivityIcon size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-white tracking-tight">
              Recent Activity
            </h1>
            <p className="text-secondary-500 dark:text-secondary-400 mt-1">
              Track all changes across your boards
            </p>
          </div>
        </div>
        <button 
            onClick={loadActivities} 
            disabled={loading}
            className="p-2 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-white/5 rounded-lg transition-colors group disabled:opacity-50"
        >
            <RefreshCw size={20} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
        </button>
      </div>

      <div className="bg-white dark:bg-[#1A1A1D] rounded-2xl p-6 sm:p-8 shadow-sm border border-secondary-200/60 dark:border-white/5 relative">
        <div className="absolute top-0 left-8 bottom-0 w-[2px] bg-secondary-100 dark:bg-white/5 hidden sm:block" />

        {loading ? (
            <div className="flex items-center justify-center py-20 relative z-10 bg-white/50 dark:bg-[#1A1A1D]/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-secondary-200 dark:border-white/10 border-t-primary-500"></div>
                    <p className="text-secondary-500 dark:text-secondary-400 text-sm font-medium animate-pulse">Loading feed...</p>
                </div>
            </div>
        ) : activities.length === 0 ? (
            <div className="text-center py-20 relative z-10">
                <div className="w-16 h-16 bg-secondary-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
                    <ActivityIcon size={32} className="text-secondary-400 dark:text-secondary-500" />
                </div>
                <h3 className="text-xl font-display font-medium text-secondary-900 dark:text-white mb-2">
                    No activity yet
                </h3>
                <p className="text-[15px] text-secondary-500 dark:text-secondary-400">
                    Start collaborating on boards to see actions appear here.
                </p>
            </div>
        ) : (
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 relative z-10"
            >
            {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
            ))}
            </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Activity;
