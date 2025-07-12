import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, X, Loader2, Moon, Sun, WifiOff } from 'lucide-react';

// =====================================================
// TOAST CONTEXT & PROVIDER (Notifications)
// =====================================================
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message) => addToast(message, 'success');
  const showError = (message) => addToast(message, 'error');
  const showWarning = (message) => addToast(message, 'warning');
  const showInfo = (message) => addToast(message, 'info');

  return (
    <ToastContext.Provider value={{ addToast, removeToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// =====================================================
// TOAST COMPONENT
// =====================================================
export const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles = "flex items-center p-4 rounded-lg shadow-lg border transition-all duration-300 transform max-w-sm";
    const animations = isLeaving 
      ? "translate-x-full opacity-0" 
      : isVisible 
        ? "translate-x-0 opacity-100" 
        : "translate-x-full opacity-0";

    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-100 ${animations}`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100 ${animations}`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-100 ${animations}`;
      default:
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100 ${animations}`;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />;
      case 'error':
      case 'warning':
        return <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />;
      default:
        return <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={handleRemove}
        className="ml-3 text-current opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2" aria-live="polite">
    {toasts.map(toast => (
      <Toast key={toast.id} toast={toast} onRemove={removeToast} />
    ))}
  </div>
);

// =====================================================
// LOADING SPINNER COMPONENT
// =====================================================
export const LoadingSpinner = ({ size = 'medium', text = '', className = '' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-2">
        <Loader2 className={`${getSizeClasses()} animate-spin text-blue-600 dark:text-blue-400`} />
        {text && (
          <span className="text-sm text-slate-600 dark:text-slate-300 animate-pulse">
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

// =====================================================
// SKELETON LOADER COMPONENTS
// =====================================================
export const SkeletonLoader = ({ className = '', children }) => (
  <div className={`animate-pulse ${className}`}>
    {children}
  </div>
);

export const SkeletonText = ({ lines = 1, className = '' }) => (
  <SkeletonLoader className={className}>
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={`h-4 bg-slate-200 dark:bg-slate-700 rounded ${
            index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  </SkeletonLoader>
);

export const SkeletonCard = ({ className = '' }) => (
  <SkeletonLoader className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex space-x-2">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-20" />
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16" />
      </div>
    </div>
  </SkeletonLoader>
);

export const SkeletonButton = ({ className = '' }) => (
  <SkeletonLoader>
    <div className={`h-10 bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`} />
  </SkeletonLoader>
);

// =====================================================
// ERROR BOUNDARY COMPONENT
// =====================================================
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// =====================================================
// ENHANCED BUTTON COMPONENT
// =====================================================
export const EnhancedButton = ({ 
  children, 
  loading = false, 
  disabled = false, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  onClick,
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-slate-600 hover:bg-slate-700 text-white border-slate-600';
      case 'outline':
        return 'bg-transparent hover:bg-slate-50 text-slate-700 border-slate-300 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-600';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-red-600';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white border-green-600';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-sm';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const baseClasses = `
    relative inline-flex items-center justify-center font-medium rounded-lg border
    transition-all duration-200 transform active:scale-95
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${isPressed ? 'scale-95' : 'scale-100'}
  `;

  return (
    <button
      className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="small" className="mr-2" />
          <span className="opacity-75">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

// =====================================================
// ENHANCED INPUT COMPONENT
// =====================================================
export const EnhancedInput = ({ 
  label, 
  error, 
  success, 
  required = false, 
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputClasses = () => {
    const baseClasses = `
      w-full px-3 py-2 border rounded-lg text-sm
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1
      dark:bg-slate-800 dark:text-white
    `;

    if (error) {
      return `${baseClasses} border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600`;
    }
    if (success) {
      return `${baseClasses} border-green-300 focus:border-green-500 focus:ring-green-500 dark:border-green-600`;
    }
    return `${baseClasses} border-slate-300 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600`;
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          className={getInputClasses()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {success && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
        )}
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-1 text-sm text-green-600 dark:text-green-400">
          {success}
        </p>
      )}
    </div>
  );
};

// =====================================================
// THEME TOGGLE COMPONENT
// =====================================================
export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg border border-slate-300 dark:border-slate-600
        bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300
        hover:bg-slate-50 dark:hover:bg-slate-700
        transition-all duration-200 transform hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

// =====================================================
// CONNECTION STATUS COMPONENT
// =====================================================
export const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">You're offline</span>
    </div>
  );
};

// =====================================================
// USAGE EXAMPLE (Optional - remove if not needed)
// =====================================================
/*
// How to use in your components:

import { 
  ThemeProvider, 
  ToastProvider, 
  useToast, 
  LoadingSpinner,
  EnhancedButton,
  EnhancedInput,
  SkeletonCard,
  ThemeToggle,
  ErrorBoundary 
} from './UIPolish';

// Wrap your app
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <YourApp />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Use in components
function YourComponent() {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Your API call
      showSuccess('Success!');
    } catch (error) {
      showError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ThemeToggle />
      <EnhancedButton loading={loading} onClick={handleSubmit}>
        Submit
      </EnhancedButton>
      {loading && <LoadingSpinner text="Processing..." />}
    </div>
  );
}
*/