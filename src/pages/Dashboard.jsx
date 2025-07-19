import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Plus, Clock, TrendingUp, User, Settings, LogOut, Menu, X } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalSessions: 0,
    practiceTime: '0m',
    averageScore: 0,
    completedSessions: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [groupedSessions, setGroupedSessions] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('recent'); 

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const sessionTypes = [
    {
      id: 'interview',
      title: 'Interview Practice',
      description: 'Practice job, visa, and performance review interviews',
      icon: <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'presentation',
      title: 'Presentation Practice',
      description: 'Improve your public speaking skills',
      icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 'meeting',
      title: 'Meeting Preparation',
      description: 'Practice for important meetings',
      icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'interviewer',
      title: 'Interviewer Tools',
      description: 'Create templates and evaluate candidates',
      icon: <User className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [userResponse, sessionsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/users/profile`, { headers }),
        fetch(`${API_BASE_URL}/sessions`, { headers })
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }

      if (sessionsResponse.ok) {
        const sessions = await sessionsResponse.json();
        
        // Calculate total practice time
        const totalMinutes = sessions.reduce((acc, session) => acc + (session.duration || 0), 0);
        const practiceTime = totalMinutes >= 60 ? 
          `${Math.round(totalMinutes / 60 * 10) / 10}h` : 
          `${totalMinutes}m`;
        
        setStats({
          totalSessions: sessions.length,
          practiceTime: practiceTime,
          averageScore: sessions.length > 0 
            ? Math.round(sessions.reduce((sum, session) => sum + (session.score || 0), 0) / sessions.length)
            : 0,
          completedSessions: sessions.filter(session => (session.score || 0) >= 80).length
        });

        // Group sessions by type
        const grouped = sessions.reduce((acc, session) => {
          const type = session.type || 'Other';
          if (!acc[type]) acc[type] = [];
          acc[type].push(session);
          return acc;
        }, {});
        
        // Sort sessions within each group by creation date (newest first)
        Object.keys(grouped).forEach(type => {
          grouped[type] = grouped[type].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });
        
        setGroupedSessions(grouped);

        const sortedSessions = sessions
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map((session, index) => ({
            id: session._id || session.id || `session-${index}`,
            type: session.type || 'Practice',
            title: session.title || `${session.type || 'Practice'} Session`,
            date: formatDate(session.createdAt),
            score: session.score || 0
          }));
        
        setRecentSessions(sortedSessions);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  const getSessionIcon = (type) => {
    const sessionType = sessionTypes.find(st => st.id === type.toLowerCase());
    return sessionType ? sessionType.icon : <MessageCircle className="w-5 h-5" />;
  };

  const getSessionColor = (type) => {
    const sessionType = sessionTypes.find(st => st.id === type.toLowerCase());
    return sessionType ? sessionType.color : 'from-blue-500 to-purple-500';
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSessionSelect = (sessionType) => {
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
    switch (sessionType.id) {
      case 'interview':
        navigate('/interviewee');
        break;
      case 'presentation':
        navigate('/presenter');
        break;
      case 'meeting':
        navigate('/meeting-prep');
        break;
      case 'interviewer':
        navigate('/interviewer');
        break;
      default:
        console.log('Unknown session type:', sessionType.id);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="text-base sm:text-lg text-slate-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CommPrep
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.fullName?.[0] || user.name?.[0] || 'U'}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-slate-900">{user.fullName || user.name}</div>
                  <div className="text-slate-500">Welcome back!</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigate('/settings')}
                  className="p-2 text-slate-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSignOut}
                  className="p-2 text-slate-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-4 space-y-4">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.fullName?.[0] || user.name?.[0] || 'U'}
                </div>
                <div>
                  <div className="font-medium text-slate-900">{user.fullName || user.name}</div>
                  <div className="text-sm text-slate-500">{user.email}</div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/settings');
                }}
                className="flex items-center space-x-2 w-full text-left p-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 w-full text-left p-2 text-slate-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {(user.fullName || user.name)?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Ready to practice and improve your communication skills? Let's get started.
          </p>
        </div>

        {/* Stats Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">{stats.totalSessions}</div>
            <div className="text-xs sm:text-sm text-slate-600">Total Sessions</div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">{stats.practiceTime}</div>
            <div className="text-xs sm:text-sm text-slate-600">Practice Time</div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">{stats.averageScore}%</div>
            <div className="text-xs sm:text-sm text-slate-600">Average Score</div>
          </div>
        </div>

        {/* Practice Modes Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Choose Your Practice Mode</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {sessionTypes.map((session) => {
              const sessionCount = groupedSessions[session.id]?.length || 0;
              return (
                <div
                  key={session.id}
                  onClick={() => handleSessionSelect(session)}
                  className={`${session.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-200`}
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${session.color} rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4`}>
                    {session.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">{session.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 line-clamp-2">{session.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs sm:text-sm text-slate-500 font-medium">
                      {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
                    </div>
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sessions Section */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recent Sessions</h2>
            <button 
              onClick={() => navigate('/sessions')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              View All
            </button>
          </div>
          
          {/* Recent Sessions */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {recentSessions.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {recentSessions.map((session) => (
                  <div key={session.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                          {session.type[0].toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{session.title}</h3>
                          <div className="text-xs sm:text-sm text-slate-600">{session.date}</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <div className="text-base sm:text-lg font-semibold text-slate-900">{session.score}%</div>
                        <div className="text-xs sm:text-sm text-slate-600">Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 sm:p-12 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-2">No sessions yet</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">Start your first practice session to see your progress here.</p>
                <button 
                  onClick={() => handleSessionSelect({ id: 'interview' })}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                >
                  Start First Session
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;