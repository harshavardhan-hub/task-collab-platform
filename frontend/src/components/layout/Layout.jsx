import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-light-bg dark:bg-dark-bg text-secondary-900 dark:text-gray-100 flex overflow-hidden selection:bg-primary-500/20">
      
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border bg-white/50 dark:bg-dark-bg/50 backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-dark-hover rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="font-display font-bold text-lg tracking-tight gradient-text">TaskCollab</div>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
        
        {/* Desktop Navbar */}
        <div className="hidden lg:block relative z-20">
          <Navbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar bg-light-bg dark:bg-dark-bg">
          <div className="h-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 lg:pt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
