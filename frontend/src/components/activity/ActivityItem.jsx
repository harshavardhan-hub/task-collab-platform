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
    <div className="group relative flex items-start gap-4 p-4 bg-white dark:bg-[#1C1C1F] hover:bg-secondary-50 dark:hover:bg-[#232326] transition-colors rounded-2xl border border-secondary-200 dark:border-dark-border shadow-sm">
      <div className="relative z-10 hidden sm:block bg-white dark:bg-[#1C1C1F] p-1 rounded-full border border-secondary-200 dark:border-dark-border">
        <Avatar user={{ id: activity.user_id, full_name: activity.user_name, avatar_url: activity.user_avatar }} size="sm" showBorder />
      </div>

      <div className="sm:hidden -ml-2">
         <Avatar user={{ id: activity.user_id, full_name: activity.user_name, avatar_url: activity.user_avatar }} size="sm" />
      </div>
      
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-dark-hover flex items-center justify-center flex-shrink-0 text-secondary-500">
            <Icon size={14} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-[13px] leading-relaxed text-secondary-900 dark:text-white mb-1">
              <span className="font-semibold">{activity.user_name || 'Someone'}</span>
              {' '}
              <span className="text-secondary-600 dark:text-secondary-300">
                {getActivityMessage(activity)}
              </span>
            </p>
            <p className="text-[11px] font-medium text-secondary-400 dark:text-secondary-500 uppercase tracking-wider">
              {getRelativeTime(activity.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
