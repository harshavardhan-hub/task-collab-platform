import React from 'react';
import clsx from 'clsx';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const Avatar = ({ user, size = 'md', className, showBorder = false }) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const borderStyles = showBorder ? 'border-2 border-white dark:border-[#121214]' : '';

  if (user?.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.full_name || user.email || 'Avatar'}
        className={clsx(
          'rounded-full object-cover shadow-sm',
          sizes[size],
          borderStyles,
          className
        )}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-semibold text-white shadow-sm',
        sizes[size],
        borderStyles,
        getAvatarColor(user?.id),
        className
      )}
    >
      {getInitials(user?.full_name || user?.email || 'Unknown')}
    </div>
  );
};

export default Avatar;
