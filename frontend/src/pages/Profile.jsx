import React, { useState } from 'react';
import { User, Mail, Calendar, Camera } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Avatar from '../components/common/Avatar';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/common/Toast';
import { formatDate } from '../utils/helpers';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const { toasts, removeToast, success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    avatarUrl: user?.avatar_url || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    
    if (result.success) {
      success('Profile updated successfully!');
      setIsEditing(false);
    } else {
      error('Failed to update profile');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-white mb-2 tracking-tight">
          Profile Settings
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400">
          Manage your account information and preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <div className="bg-white dark:bg-[#1A1A1D] rounded-2xl p-8 shadow-sm border border-secondary-200/60 dark:border-white/5 text-center relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary-500/10 to-transparent dark:from-primary-500/5" />
            
            <div className="relative z-10">
                <div className="relative inline-block mb-5">
                    <Avatar user={user} size="2xl" className="mx-auto shadow-md ring-4 ring-white dark:ring-[#1A1A1D]" />
                    {isEditing && (
                        <div className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-primary-600 transition-colors">
                            <Camera size={16} />
                        </div>
                    )}
                </div>
                
                <h2 className="text-2xl font-display font-bold text-secondary-900 dark:text-white mb-1">
                {user?.full_name}
                </h2>
                <p className="text-[15px] text-secondary-500 dark:text-secondary-400 font-medium mb-6">
                {user?.email}
                </p>
                
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-secondary-50 dark:bg-white/5 rounded-full text-xs font-semibold text-secondary-600 dark:text-secondary-300 border border-secondary-200/50 dark:border-white/5">
                <Calendar size={14} />
                <span>Member since {formatDate(user?.created_at)}</span>
                </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Form Main */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <div className="bg-white dark:bg-[#1A1A1D] rounded-2xl p-8 shadow-sm border border-secondary-200/60 dark:border-white/5">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-secondary-100 dark:border-white/5">
              <div>
                <h3 className="text-xl font-display font-bold text-secondary-900 dark:text-white">
                    Personal Information
                </h3>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">Update your personal details here.</p>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="bg-secondary-50 dark:bg-white/5 border-secondary-200 dark:border-white/10"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    leftIcon={<User size={18} />}
                    disabled={!isEditing}
                    fullWidth
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={user?.email}
                    leftIcon={<Mail size={18} />}
                    disabled
                    fullWidth
                    helperText="Email cannot be changed"
                  />
              </div>

              <Input
                label="Avatar URL"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                disabled={!isEditing}
                fullWidth
                helperText="Enter a valid image URL for your profile picture"
              />

              {isEditing && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 pt-6 mt-6 border-t border-secondary-100 dark:border-white/5"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        fullName: user?.full_name || '',
                        avatarUrl: user?.avatar_url || '',
                      });
                    }}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="px-8 shadow-md"
                  >
                    Save Changes
                  </Button>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
