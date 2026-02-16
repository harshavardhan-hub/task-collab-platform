import React, { useState } from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Avatar from '../components/common/Avatar';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/common/Toast';
import { formatDate } from '../utils/helpers';

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

  return (
    <div className="max-w-4xl mx-auto">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg text-center">
            <Avatar user={user} size="xl" className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {user?.full_name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {user?.email}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={16} />
              <span>Joined {formatDate(user?.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h3>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <Input
                label="Avatar URL"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                disabled={!isEditing}
                fullWidth
                helperText="Enter a URL to your profile picture"
              />

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        fullName: user?.full_name || '',
                        avatarUrl: user?.avatar_url || '',
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
