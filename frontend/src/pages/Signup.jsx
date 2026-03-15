import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Mail, Lock, User, Loader } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const Signup = () => {
  const { isAuthenticated, signup, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    await signup(formData.email, formData.password, formData.fullName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0B] relative overflow-hidden p-4">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/10 dark:bg-primary-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-[30%] left-[20%] w-[20%] h-[20%] bg-accent-500/5 dark:bg-accent-500/5 blur-[80px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10 my-8"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-xl shadow-primary-500/20 mb-6 relative group"
          >
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-8 h-8 relative z-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-secondary-900 dark:text-white mb-2 tracking-tight">Get Started</h1>
          <p className="text-secondary-500 dark:text-secondary-400 font-medium tracking-wide">Create your TaskCollab account</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/80 dark:bg-[#1A1A1D]/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-secondary-900/5 dark:shadow-black/50 border border-white/50 dark:border-white/5 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-blue-500" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {(error || validationError) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl"
              >
                <p className="text-[13px] font-medium text-red-600 dark:text-red-400 text-center">
                  {validationError || error}
                </p>
              </motion.div>
            )}

            <div className="space-y-4">
                <Input
                label="Full Name"
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.fullName}
                onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }); clearError(); setValidationError(''); }}
                leftIcon={<User size={18} />}
                required
                fullWidth
                />

                <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); clearError(); setValidationError(''); }}
                leftIcon={<Mail size={18} />}
                required
                fullWidth
                />

                <Input
                label="Password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => { setFormData({ ...formData, password: e.target.value }); clearError(); setValidationError(''); }}
                leftIcon={<Lock size={18} />}
                required
                fullWidth
                />

                <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => { setFormData({ ...formData, confirmPassword: e.target.value }); setValidationError(''); }}
                leftIcon={<Lock size={18} />}
                required
                fullWidth
                />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              size="lg"
              className="mt-8 text-[15px] font-semibold tracking-wide shadow-lg shadow-primary-500/20"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[14px] text-secondary-500 dark:text-secondary-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
