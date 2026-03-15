import React, { useEffect, useState } from 'react';
import ActivityItem from './ActivityItem';
import { activityAPI } from '../../services/api';
import { Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

const ActivityFeed = ({ boardId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [boardId]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getBoardActivity(boardId, page);
      setActivities(response.data.activities);
      setHasMore(response.data.page < response.data.totalPages);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const response = await activityAPI.getBoardActivity(boardId, page + 1);
      setActivities([...activities, ...response.data.activities]);
      setPage(page + 1);
      setHasMore(response.data.page < response.data.totalPages);
    } catch (error) {
      console.error('Failed to load more activities:', error);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-primary-500" size={28} strokeWidth={2.5} />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl bg-white/50 border border-dashed border-secondary-200 dark:border-dark-border dark:bg-[#1A1A1D]/50 backdrop-blur-sm">
        <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">No activity yet on this board.</p>
      </div>
    );
  }

  return (
    <div className="relative pb-6">
      {/* Timeline line */}
      <div className="absolute left-[28px] sm:left-[36px] top-4 bottom-0 w-px bg-secondary-200 dark:bg-dark-border -z-10 hidden sm:block" />
      
      <div className="space-y-4">
        <AnimatePresence>
          {activities.map((activity, index) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.3) }}
              key={activity.id}
            >
              <ActivityItem activity={activity} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="mt-8 text-center pt-2">
          <Button
            variant="ghost"
            onClick={loadMore}
            className="w-full sm:w-auto px-8 rounded-full border border-secondary-200 dark:border-dark-border shadow-sm text-xs font-semibold uppercase tracking-wider bg-white dark:bg-[#1A1A1D]"
          >
            Load Older Activity
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
