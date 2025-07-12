import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Plus, Clock, TrendingUp, User, Settings, LogOut, Menu, X } from 'lucide-react';

// Mock data for demonstration
const mockUser = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: null,
  joinDate: "January 2025"
};

const mockStats = {
  totalSessions: 12,
  hourspracticed: 8.5,
  averageScore: 85,
  improvement: "+12%"
};

const mockRecentSessions = [
  {
    id: 1,
    type: "Interview",
    title: "Software Engineer Interview",
    date: "2 hours ago",
    score: 88,
    duration: "25 min"
  },
  {
    id: 2,
    type: "Presentation",
    title: "Product Launch Presentation",
    date: "Yesterday",
    score: 92,
    duration: "18 min"
  },
  {
    id: 3,
    type: "Meeting",
    title: "Team Standup Practice",
    date: "2 days ago",
    score: 79,
    duration: "12 min"
  }
];

const sessionTypes = [
  {
    id: 'interview',
    title: 'Interview Practice',
    description: 'Prepare for job interviews with AI-generated questions',
    icon: <MessageCircle className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    sessions: 8
  },
  {
    id: 'presentation',
    title: 'Presentation Practice',
    description: 'Improve your public speaking and presentation skills',
    icon: <TrendingUp className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    sessions: 3
  },
  {
    id: 'meeting',
    title: 'Meeting Preparation',
    description: 'Practice for important meetings and discussions',
    icon: <Clock className="w-8 h-8" />,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    sessions: 1
  },
  {
    id: 'interviewer',
    title: 'Interviewer Tools',
    description: 'Create interview templates and evaluate candidates',
    icon: <User className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    sessions: 0
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const handleSessionSelect = (sessionType) => {
    setSelectedSession(sessionType);
    
    // Navigate to the appropriate page based on session type
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
    // Clear any stored user data
    localStorage.removeItem('commprep_user');
    localStorage.removeItem('commprep_sessions');
    
    // Navigate back to landing page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - clickable to dashboard */}
            <div 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CommPrep
              </span>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {mockUser.name[0]}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-slate-900">{mockUser.name}</div>
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
                  {mockUser.name[0]}
                </div>
                <div>
                  <div className="font-medium text-slate-900">{mockUser.name}</div>
                  <div className="text-sm text-slate-500">{mockUser.email}</div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/settings')}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {mockUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-600">
            Ready to practice and improve your communication skills? Let's get started.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{mockStats.totalSessions}</div>
            <div className="text-sm text-slate-600">Total Sessions</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{mockStats.hourspracticed}h</div>
            <div className="text-sm text-slate-600">Hours Practiced</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{mockStats.averageScore}%</div>
            <div className="text-sm text-slate-600">Average Score</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-green-600">{mockStats.improvement}</div>
            <div className="text-sm text-slate-600">Improvement</div>
          </div>
        </div>

        {/* Session Types */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose Your Practice Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sessionTypes.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionSelect(session)}
                className={`${session.bgColor} rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-200`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${session.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                  {session.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{session.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{session.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{session.sessions} sessions</span>
                  <Plus className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Recent Sessions</h2>
            <button 
              onClick={() => navigate('/sessions')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              View All
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {mockRecentSessions.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {mockRecentSessions.map((session) => (
                  <div key={session.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                          {session.type[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{session.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <span>{session.date}</span>
                            <span>•</span>
                            <span>{session.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-slate-900">{session.score}%</div>
                        <div className="text-sm text-slate-600">Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No sessions yet</h3>
                <p className="text-slate-600 mb-6">Start your first practice session to see your progress here.</p>
                <button 
                  onClick={() => handleSessionSelect({ id: 'interview' })}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
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