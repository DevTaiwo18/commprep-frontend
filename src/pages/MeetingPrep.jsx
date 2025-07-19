import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MeetingPrep = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState('setup'); 
  const [meetingTitle, setMeetingTitle] = useState('');
  const [practiceNotes, setPracticeNotes] = useState('');
  const [startTime, setStartTime] = useState(null);
  const textareaRef = useRef(null);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const MeetingSetup = () => {
    const handleTitleChange = (e) => {
      setMeetingTitle(e.target.value);
    };

    const handleNext = () => {
      if (meetingTitle.trim()) {
        setStartTime(new Date());
        setStep('practice');
      }
    };

    return (
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Meeting Prep</h1>
          <p className="text-sm sm:text-base text-slate-600">Prepare for your meeting</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm border border-slate-200">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Meeting Title</label>
            <input
              type="text"
              value={meetingTitle}
              onChange={handleTitleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="e.g., Team Sync, Client Check-in, Project Review"
              autoFocus
              dir="ltr"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <button
              onClick={handleNext}
              disabled={!meetingTitle.trim()}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Start Practice
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PracticeSession = () => {
    const handleNotesChange = (e) => {
      const newValue = e.target.value;
      const cursorPosition = e.target.selectionStart;
      
      setPracticeNotes(newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
      }, 0);
    };

    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Practice Session</h1>
          <p className="text-sm sm:text-base text-slate-600 px-4">
            Prepare your key points for: <strong className="break-words">{meetingTitle}</strong>
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm border border-slate-200">
          <div>
            <label className="block text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">
              What will you discuss in this meeting?
            </label>
            <textarea
              ref={textareaRef}
              value={practiceNotes}
              onChange={handleNotesChange}
              className="w-full h-48 sm:h-64 px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
              placeholder="Write your key points, agenda items, questions to ask, or topics to discuss..."
              autoFocus
              dir="ltr"
              style={{ 
                direction: 'ltr', 
                textAlign: 'left',
                unicodeBidi: 'normal'
              }}
            />
            <div className="text-xs text-slate-500 mt-2">
              {practiceNotes.length} characters
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
          <button
            onClick={() => setStep('setup')}
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button
            onClick={() => setStep('summary')}
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Finish
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  };

  // Step 3: Summary with Save
  const SummaryView = () => {
    const [hasSaved, setHasSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const hasPracticeNotes = practiceNotes.trim().length > 0;
    const preparationScore = hasPracticeNotes ? 100 : 50;

    useEffect(() => {
      const saveSession = async () => {
        if (hasSaved || isSaving || !startTime || !meetingTitle.trim()) return;

        try {
          setIsSaving(true);
          const token = localStorage.getItem('token');

          if (!token) {
            console.error('No authentication token found');
            return;
          }

          const endTime = new Date();
          const durationMinutes = Math.max(1, Math.round((endTime - startTime) / (1000 * 60)));

          const sessionData = {
            type: 'meeting',
            title: `${meetingTitle} - Meeting Prep`,
            context: { 
              meetingTitle: meetingTitle,
              practiceCompleted: hasPracticeNotes
            },
            questions: [`Meeting: ${meetingTitle}`, `Preparation type: Meeting prep`],
            answers: [`Practice notes: ${hasPracticeNotes ? 'Completed' : 'Not completed'}`, `Notes length: ${practiceNotes.length} characters`],
            completedAt: endTime,
            duration: durationMinutes,
            score: preparationScore
          };

          const response = await fetch(`${API_BASE_URL}/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(sessionData)
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Meeting session saved successfully:', result);
            setHasSaved(true);
          } else {
            const errorText = await response.text();
            console.error('Failed to save session:', response.status, errorText);
          }
        } catch (error) {
          console.error('Error saving session:', error);
        } finally {
          setIsSaving(false);
        }
      };

      if (meetingTitle.trim() && !hasSaved && !isSaving) {
        const timer = setTimeout(() => {
          saveSession();
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }, [meetingTitle, hasPracticeNotes, preparationScore, hasSaved, isSaving, startTime]);

    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Meeting Prep Complete!</h1>
          <p className="text-sm sm:text-base text-slate-600 px-4">
            You're ready for: <strong className="break-words">{meetingTitle}</strong>
          </p>
        </div>

        {/* Stats - Mobile Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{preparationScore}%</div>
            <div className="text-sm sm:text-base text-slate-600">Preparation Score</div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{practiceNotes.length}</div>
            <div className="text-sm sm:text-base text-slate-600">Characters Written</div>
          </div>
        </div>

        {/* Practice Summary */}
        {hasPracticeNotes && (
          <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm border border-slate-200 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4">Your Meeting Notes</h3>
            <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
              <p className="text-slate-700 whitespace-pre-wrap text-sm sm:text-base break-words">{practiceNotes}</p>
            </div>
          </div>
        )}

        {/* Simple Feedback */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-8 border border-blue-200 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">💡 You're Ready!</h3>
          <div className="space-y-2 text-slate-700 text-sm sm:text-base">
            {hasPracticeNotes ? (
              <p>✓ Great job preparing your key points! You're ready for a successful meeting.</p>
            ) : (
              <p>Next time, try adding some notes to better organize your thoughts.</p>
            )}
            <p>🎯 Remember to stay focused on your main objectives during the meeting.</p>
          </div>
        </div>

        {/* Action Buttons - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => {
              setMeetingTitle('');
              setPracticeNotes('');
              setStartTime(null);
              setStep('setup');
            }}
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            New Meeting Prep
          </button>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header - Mobile Responsive */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CommPrep
              </span>
            </div>

            <button
              onClick={handleBackToDashboard}
              className="flex items-center px-3 sm:px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {step === 'setup' && <MeetingSetup />}
        {step === 'practice' && <PracticeSession />}
        {step === 'summary' && <SummaryView />}
      </main>
    </div>
  );
};

export default MeetingPrep;