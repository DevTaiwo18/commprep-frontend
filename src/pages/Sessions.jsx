import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Search, Calendar, Clock, TrendingUp, Trash2 } from 'lucide-react';

const Sessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
        setFilteredSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = sessions.filter(session =>
        session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSessions(filtered);
    } else {
      setFilteredSessions(sessions);
    }
  }, [sessions, searchTerm]);

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/sessions/${sessionId}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const updatedSessions = sessions.filter(session => session._id !== sessionId);
        setSessions(updatedSessions);
        setFilteredSessions(updatedSessions);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const getSessionIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'interview': return '💼';
      case 'presentation': return '📊';
      case 'meeting': return '🤝';
      default: return '📝';
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalHours = totalMinutes >= 60 ? 
    Math.round(totalMinutes / 60 * 10) / 10 : 
    Math.round(totalMinutes * 10) / 10;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div className="text-lg text-slate-600">Loading sessions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CommPrep
              </span>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-slate-600 hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">All Sessions</h1>
          <p className="text-slate-600 text-sm sm:text-base">Review your practice sessions</p>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">{sessions.length}</div>
            <div className="text-xs sm:text-sm text-slate-600">Total Sessions</div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {totalMinutes >= 60 ? `${totalHours}h` : `${totalHours}m`}
            </div>
            <div className="text-xs sm:text-sm text-slate-600">Total Practice Time</div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {sessions.filter(s => (s.score || 0) >= 80).length}
            </div>
            <div className="text-xs sm:text-sm text-slate-600">High Scores (80+)</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Sessions List */}
        {filteredSessions.length > 0 ? (
          <div className="space-y-4">
            {filteredSessions
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((session) => (
              <div key={session._id} className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                {/* Mobile Layout */}
                <div className="block sm:hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl sm:text-2xl">{getSessionIcon(session.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">{session.title}</h3>
                        <div className="flex items-center space-x-3 text-xs text-slate-600 mt-1">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(session.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(session.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSession(session._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getScoreColor(session.score || 0)}`}>
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
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getSessionIcon(session.type)}</div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{session.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(session.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(session.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getScoreColor(session.score || 0)}`}>
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

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteSession(session._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchTerm ? 'No sessions found' : 'No sessions yet'}
            </h3>
            <p className="text-slate-600 mb-6 text-sm sm:text-base px-4">
              {searchTerm 
                ? 'Try a different search term'
                : 'Start your first practice session to see your progress here'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
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