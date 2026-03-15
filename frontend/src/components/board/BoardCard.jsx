import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import Avatar from '../common/Avatar';
import { getContrastColor } from '../../utils/helpers';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const BoardCard = ({ board }) => {
  const bgColor = board.background_color || '#5E6AD2';
  const textColor = getContrastColor(bgColor);
  const isDarkText = textColor === '#000000';

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={`/boards/${board.id}`}
        className="block group outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-[20px]"
      >
        <div
          className="relative h-44 rounded-[20px] p-6 shadow-sm group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-shadow duration-300 overflow-hidden border border-black/5 dark:border-white/5"
          style={{ backgroundColor: bgColor }}
        >
          {/* Subtle overlay gradients */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3
                className={clsx("text-[22px] font-display font-bold mb-1.5 truncate tracking-tight drop-shadow-sm", isDarkText ? 'text-secondary-900' : 'text-white')}
              >
                {board.title}
              </h3>
              {board.description && (
                <p
                  className={clsx("text-sm truncate-2 drop-shadow-sm leading-snug", isDarkText ? 'text-secondary-800/80' : 'text-white/80')}
                >
                  {board.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              {/* Members */}
              <div className="flex -space-x-2.5">
                {board.members?.slice(0, 3).map((member) => (
                  <Avatar
                    key={member.id}
                    user={member}
                    size="sm"
                    className="ring-2 ring-white/20 shadow-sm"
                  />
                ))}
                {board.members?.length > 3 && (
                  <div
                    className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white/20 shadow-sm backdrop-blur-md bg-white/20",
                      isDarkText ? 'text-secondary-900' : 'text-white'
                    )}
                  >
                    +{board.members.length - 3}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div 
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-md bg-white/20 border border-white/10 shadow-sm transition-colors",
                  isDarkText ? 'text-secondary-900' : 'text-white'
                )}
              >
                <CheckSquare size={14} className={isDarkText ? 'opacity-70' : 'opacity-80'} strokeWidth={2.5} />
                <span className="text-xs font-bold">{board.task_count || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BoardCard;
