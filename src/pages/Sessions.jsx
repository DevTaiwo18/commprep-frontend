import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Filter, Search, Calendar, Clock, TrendingUp, MoreVertical, Play, Trash2 } from 'lucide-react';

const Sessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = JSON.parse(localStorage.getItem('commprep_sessions') || '[]');
    setSessions(savedSessions);
    setFilteredSessions(savedSessions);
  }, []);

  useEffect(() => {
    // Filter and sort sessions
    let filtered = sessions;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(session => 
        session.subType === filterType || session.type.toLowerCase().includes(filterType)
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'duration':
          return (b.duration || 0) - (a.duration || 0);
        default:
          return 0;
      }
    });

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, filterType, sortBy]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      setSessions(updatedSessions);
      localStorage.setItem('commprep_sessions', JSON.stringify(updatedSessions));
    }
  };

  const handleReplaySession = (session) => {
    // Navigate to appropriate session type based on session data
    if (session.subType === 'job' || session.subType === 'visa' || session.subType === 'university') {
      navigate('/interviewee');
    } else if (session.type === 'Presentation') {
      navigate('/presenter');
    } else if (session.type === 'Meeting') {
      navigate('/meeting-prep');
    } else {
      navigate('/interviewee'); // Default to interview
    }
  };

  const getSessionIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'interview':
      case 'job':
      case 'visa':
      case 'university':
        return '💼';
      case 'presentation':
        return '📊';
      case 'meeting':
        return '🤝';
      default:
        return '📝';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const SessionCard = ({ session }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getSessionIcon(session.subType || session.type)}</div>
            <div>
              <h3 className="font-semibold text-slate-900">{session.title}</h3>
              <p className="text-sm text-slate-600">
                {session.subType?.charAt(0).toUpperCase() + session.subType?.slice(1) || session.type} Session
              </p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                <button
                  onClick={() => {
                    handleReplaySession(session);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Replay Session
                </button>
                <button
                  onClick={() => {
                    handleDeleteSession(session.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Session
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className={`text-lg font-semibold ${getScoreColor(session.score)}`}>
              {session.score || 0}%
            </div>
            <div className="text-xs text-slate-500">Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900">
              {session.duration || 0}m
            </div>
            <div className="text-xs text-slate-500">Duration</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900">
              {session.questions?.length || 0}
            </div>
            <div className="text-xs text-slate-500">Questions</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(session.createdAt)}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {session.date}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CommPrep
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">All Sessions</h1>
          <p className="text-slate-600">Review and manage your practice sessions</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">{sessions.length}</div>
            <div className="text-sm text-slate-600">Total Sessions</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">
              {Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / (sessions.length || 1))}%
            </div>
            <div className="text-sm text-slate-600">Average Score</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">
              {Math.round(sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60)}h
            </div>
            <div className="text-sm text-slate-600">Total Practice</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-green-600">
              {sessions.filter(s => (s.score || 0) >= 80).length}
            </div>
            <div className="text-sm text-slate-600">High Scores (80+)</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="job">Job Interviews</option>
                <option value="visa">Visa Interviews</option>
                <option value="university">University Interviews</option>
                <option value="presentation">Presentations</option>
                <option value="meeting">Meetings</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="score">Highest Score</option>
                <option value="duration">Longest Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchTerm || filterType !== 'all' ? 'No sessions found' : 'No sessions yet'}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start your first practice session to see your progress here'
              }
            </p>
            {(!searchTerm && filterType === 'all') && (
              <button
                onClick={handleBackToDashboard}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Start First Session
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Sessions;