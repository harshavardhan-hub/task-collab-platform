import React, { useEffect, useState } from 'react';
import ActivityItem from './ActivityItem';
import { activityAPI } from '../../services/api';
import { Loader } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="animate-spin text-primary-500" size={24} />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-base"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;
