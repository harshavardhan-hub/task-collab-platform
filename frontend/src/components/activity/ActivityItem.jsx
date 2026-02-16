import React from 'react';
import Avatar from '../common/Avatar';
import { getActivityMessage, getRelativeTime } from '../../utils/helpers';
import {
  FolderPlus,
  ListPlus,
  CheckSquare,
  Trash2,
  Edit,
  UserPlus,
  MoveHorizontal,
} from 'lucide-react';

const ActivityItem = ({ activity }) => {
  const icons = {
    board_created: FolderPlus,
    list_created: ListPlus,
    list_updated: Edit,
    list_deleted: Trash2,
    task_created: CheckSquare,
    task_updated: Edit,
    task_moved: MoveHorizontal,
    task_deleted: Trash2,
    user_assigned: UserPlus,
    user_unassigned: UserPlus,
    member_added: UserPlus,
  };

  const Icon = icons[activity.action] || CheckSquare;

  return (
    <div className="flex items-start gap-3 p-3 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700">
      <Avatar user={{ id: activity.user_id, full_name: activity.user_name, avatar_url: activity.user_avatar }} size="sm" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <Icon size={16} className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white">
              <span className="font-medium">{activity.user_name || 'Someone'}</span>
              {' '}
              <span className="text-gray-600 dark:text-gray-400">
                {getActivityMessage(activity)}
              </span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {getRelativeTime(activity.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
