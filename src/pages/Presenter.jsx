import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, ArrowRight, Play, Pause, Square, Mic, MicOff, Clock, RotateCcw } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Presenter = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState('setup'); 
  const [presentationData, setPresentationData] = useState({
    topic: '',
    duration: 15,
    type: 'business'
  });
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const startPractice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.onstop = () => {
        setHasRecorded(true);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setStartTime(new Date());
      setIsTimerRunning(true);
      setIsPaused(false);
      timerIntervalRef.current = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          const targetDuration = presentationData.duration * 60;
          
          // Auto-stop when target duration reached
          if (newTime >= targetDuration) {
            stopPractice();
            return targetDuration;
          }
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopPractice = () => {
    // Stop recording
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    // Stop timer
    setIsTimerRunning(false);
    setIsPaused(false);
    clearInterval(timerIntervalRef.current);
    
    // Auto-navigate to summary after a short delay
    setTimeout(() => {
      setStep('summary');
    }, 1000);
  };

  const resetPractice = () => {
    setTimeElapsed(0);
    setIsTimerRunning(false);
    setIsPaused(false);
    setIsRecording(false);
    setHasRecorded(false);
    setStartTime(null);
    clearInterval(timerIntervalRef.current);
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Step 1: Setup Form
  const SetupForm = () => {
    const [localData, setLocalData] = useState(presentationData);

    const handleNext = () => {
      setPresentationData(localData);
      setStep('practice');
    };

    const handleInputChange = (field, value) => {
      setLocalData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Presentation Setup</h1>
          <p className="text-sm sm:text-base text-slate-600">Configure your presentation practice</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm border border-slate-200">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Presentation Topic</label>
              <input
                type="text"
                value={localData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g., Q4 Sales Review, Product Launch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Presentation Type</label>
              <select
                value={localData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="business">Business Presentation</option>
                <option value="academic">Academic Presentation</option>
                <option value="sales">Sales Pitch</option>
                <option value="creative">Creative Showcase</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
              <select
                value={localData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>
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
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Start Practice
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step 2: Practice Session
  const PracticeSession = () => {
    const targetDuration = presentationData.duration * 60;
    const progressPercentage = Math.min((timeElapsed / targetDuration) * 100, 100);

    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Practice Session</h1>
          <p className="text-sm sm:text-base text-slate-600">Practice your presentation with timer and recording</p>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm border border-slate-200">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6 px-2 truncate">{presentationData.topic}</h3>
            
            {/* Timer Display - Mobile Responsive */}
            <div className="relative mb-6 sm:mb-8">
              <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900">{formatTime(timeElapsed)}</div>
                  <div className="text-xs sm:text-sm text-slate-600">
                    / {formatTime(targetDuration)}
                  </div>
                </div>
              </div>
            </div>

            {/* Single Control Button - Mobile Responsive */}
            <div className="flex justify-center mb-6 sm:mb-8">
              {!isTimerRunning && timeElapsed === 0 && (
                <button
                  onClick={startPractice}
                  className="flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-base sm:text-lg font-semibold"
                >
                  <Mic className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="hidden sm:inline">Start Practice & Recording</span>
                  <span className="sm:hidden">Start Practice</span>
                </button>
              )}
              
              {isTimerRunning && (
                <button
                  onClick={stopPractice}
                  className="flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors animate-pulse text-base sm:text-lg font-semibold"
                >
                  <Square className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Stop Practice
                </button>
              )}
              
              {timeElapsed > 0 && !isTimerRunning && (
                <button
                  onClick={resetPractice}
                  className="flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-base sm:text-lg font-semibold"
                >
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Reset Practice
                </button>
              )}
            </div>

            {/* Status Display */}
            {isTimerRunning && isRecording && (
              <div className="flex items-center justify-center text-red-600 mb-4 sm:mb-6">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
                <span className="text-base sm:text-lg font-medium">Recording & Timer Running...</span>
              </div>
            )}

            {!isTimerRunning && timeElapsed > 0 && (
              <div className="flex items-center justify-center text-green-600 mb-4 sm:mb-6">
                <span className="text-base sm:text-lg font-medium">✓ Practice Session Completed</span>
              </div>
            )}

            {/* Progress Info */}
            <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-slate-600">
              {progressPercentage > 100 ? (
                <span className="text-red-600 font-medium">
                  Over time by {formatTime(timeElapsed - targetDuration)}
                </span>
              ) : (
                <span>
                  {Math.round(progressPercentage)}% of target duration
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation - Mobile Responsive */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
          <button
            onClick={() => setStep('setup')}
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Setup
          </button>
          {timeElapsed > 0 && !isTimerRunning && (
            <button
              onClick={() => setStep('summary')}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              View Summary
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Step 3: Summary with Backend Save
  const SummaryView = () => {
    const [hasSaved, setHasSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const targetDuration = presentationData.duration * 60;
    const timeVariance = timeElapsed - targetDuration;
    const completionScore = Math.min(Math.round((timeElapsed / targetDuration) * 100), 100);

    useEffect(() => {
      const saveSession = async () => {
        if (hasSaved || isSaving || !startTime) return;

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
            type: 'presentation',
            title: `${presentationData.topic || 'Presentation'} Practice Session`,
            context: { 
              originalType: presentationData.type,
              topic: presentationData.topic,
              targetDuration: presentationData.duration
            },
            questions: [`Presentation: ${presentationData.topic}`, `Type: ${presentationData.type}`, `Duration: ${presentationData.duration} minutes`],
            answers: [`Practiced for ${formatTime(timeElapsed)}`, `Recording: ${hasRecorded ? 'Yes' : 'No'}`, `Time variance: ${timeVariance > 0 ? '+' : ''}${formatTime(Math.abs(timeVariance))}`],
            completedAt: endTime,
            duration: durationMinutes,
            score: completionScore
          };

          console.log('Saving presentation session with duration:', durationMinutes, 'minutes');

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
            console.log('Presentation session saved successfully:', result);
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

      if (presentationData.topic && timeElapsed > 0 && !hasSaved && !isSaving) {
        const timer = setTimeout(() => {
          saveSession();
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }, [presentationData, timeElapsed, hasSaved, isSaving, startTime, hasRecorded, completionScore, timeVariance]);

    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Practice Summary</h1>
          <p className="text-sm sm:text-base text-slate-600">Review your presentation practice session</p>
        </div>

        {/* Stats - Mobile Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{formatTime(timeElapsed)}</div>
            <div className="text-sm sm:text-base text-slate-600">Time Practiced</div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{completionScore}%</div>
            <div className="text-sm sm:text-base text-slate-600">Completion Score</div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{hasRecorded ? 'Yes' : 'No'}</div>
            <div className="text-sm sm:text-base text-slate-600">Recording Made</div>
          </div>
        </div>

        {/* Session Details - Mobile Responsive */}
        <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm border border-slate-200 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Session Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <span className="text-sm text-slate-600">Topic:</span>
              <p className="font-medium text-slate-900 text-sm sm:text-base break-words">{presentationData.topic}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Type:</span>
              <p className="font-medium text-slate-900 text-sm sm:text-base capitalize">{presentationData.type}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Target Duration:</span>
              <p className="font-medium text-slate-900 text-sm sm:text-base">{presentationData.duration} minutes</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Time Variance:</span>
              <p className={`font-medium text-sm sm:text-base ${timeVariance > 0 ? 'text-red-600' : timeVariance < -60 ? 'text-orange-600' : 'text-green-600'}`}>
                {timeVariance > 0 ? '+' : ''}{formatTime(Math.abs(timeVariance))}
              </p>
            </div>
          </div>
        </div>

        {/* Feedback - Mobile Responsive */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-8 border border-blue-200 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">💡 Feedback</h3>
          <div className="space-y-2 sm:space-y-3">
            {Math.abs(timeVariance) <= 60 && (
              <p className="text-slate-700 text-sm sm:text-base">✓ Great timing! You stayed close to your target duration.</p>
            )}
            {timeVariance > 60 && (
              <p className="text-slate-700 text-sm sm:text-base">⚠️ Your presentation ran over time. Consider practicing with a stricter time limit.</p>
            )}
            {timeVariance < -60 && (
              <p className="text-slate-700 text-sm sm:text-base">⚠️ Your presentation was shorter than planned. Consider adding more content.</p>
            )}
            {hasRecorded && (
              <p className="text-slate-700 text-sm sm:text-base">✓ Good job recording yourself! This helps identify areas for improvement.</p>
            )}
            {!hasRecorded && (
              <p className="text-slate-700 text-sm sm:text-base">💡 Try recording yourself next time to evaluate your delivery and speaking pace.</p>
            )}
          </div>
        </div>

        {/* Action Buttons - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => {
              resetPractice();
              setStep('practice');
            }}
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Practice Again
          </button>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            New Presentation
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
        {step === 'setup' && <SetupForm />}
        {step === 'practice' && <PracticeSession />}
        {step === 'summary' && <SummaryView />}
      </main>
    </div>
  );
};

export default Presenter;