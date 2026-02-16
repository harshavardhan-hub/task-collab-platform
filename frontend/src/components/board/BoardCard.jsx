import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckSquare } from 'lucide-react';
import Avatar from '../common/Avatar';
import { getContrastColor } from '../../utils/helpers';

const BoardCard = ({ board }) => {
  const textColor = getContrastColor(board.background_color || '#6366F1');

  return (
    <Link
      to={`/boards/${board.id}`}
      className="block group card-hover"
    >
      <div
        className="relative h-40 rounded-2xl p-6 shadow-md overflow-hidden"
        style={{ backgroundColor: board.background_color || '#6366F1' }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/20" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <h3
              className="text-xl font-semibold mb-2 truncate"
              style={{ color: textColor }}
            >
              {board.title}
            </h3>
            {board.description && (
              <p
                className="text-sm opacity-90 truncate-2"
                style={{ color: textColor }}
              >
                {board.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            {/* Members */}
            <div className="flex -space-x-2">
              {board.members?.slice(0, 3).map((member) => (
                <Avatar
                  key={member.id}
                  user={member}
                  size="sm"
                  className="ring-2 ring-white dark:ring-dark-card"
                />
              ))}
              {board.members?.length > 3 && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ring-2 ring-white dark:ring-dark-card"
                  style={{ backgroundColor: textColor, color: board.background_color }}
                >
                  +{board.members.length - 3}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3" style={{ color: textColor }}>
              <div className="flex items-center gap-1 text-sm">
                <CheckSquare size={16} />
                <span>{board.task_count || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
      </div>
    </Link>
  );
};

export default BoardCard;
