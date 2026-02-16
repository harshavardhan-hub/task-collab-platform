import React, { useEffect, useState } from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import ActivityItem from '../components/activity/ActivityItem';
import { activityAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/common/Toast';

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

  return (
    <div className="max-w-4xl mx-auto">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ActivityIcon className="text-primary-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Track all changes across your boards
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-dark-card rounded-2xl">
          <ActivityIcon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No activity yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start collaborating on boards to see activity here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;
