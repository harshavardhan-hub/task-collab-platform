import React from 'react';
import clsx from 'clsx';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const Avatar = ({ user, size = 'md', className }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  if (user?.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.full_name || user.email}
        className={clsx(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-semibold text-white',
        sizes[size],
        getAvatarColor(user?.id),
        className
      )}
    >
      {getInitials(user?.full_name || user?.email)}
    </div>
  );
};

export default Avatar;
