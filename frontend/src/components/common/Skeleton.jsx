import React from 'react';
import clsx from 'clsx';

export const Skeleton = ({ className, variant = 'rectangular' }) => {
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div
      className={clsx(
        'skeleton',
        variants[variant],
        className
      )}
    />
  );
};

export const BoardCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-md">
    <Skeleton className="h-6 w-3/4 mb-3" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <div className="flex items-center justify-between">
      <div className="flex -space-x-2">
        <Skeleton variant="circular" className="w-8 h-8" />
        <Skeleton variant="circular" className="w-8 h-8" />
        <Skeleton variant="circular" className="w-8 h-8" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const TaskCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-card rounded-lg p-3 shadow-sm">
    <Skeleton className="h-5 w-full mb-2" />
    <Skeleton className="h-3 w-2/3 mb-3" />
    <div className="flex items-center justify-between">
      <Skeleton variant="circular" className="w-6 h-6" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

export default Skeleton;
