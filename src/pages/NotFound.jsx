import React from 'react';
import { MessageCircle, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CommPrep
          </span>
        </div>

        {/* 404 Content */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-slate-300 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Page Not Found</h2>
          <p className="text-slate-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Home
          </button>
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center bg-white text-slate-700 px-6 py-3 rounded-full font-semibold border border-slate-300 hover:bg-slate-50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;