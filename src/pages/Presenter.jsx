import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, ArrowRight, Play, Pause, Square, Mic, MicOff, Clock, Users, BookOpen, CheckCircle, RotateCcw, Save, Download, Volume2 } from 'lucide-react';

// Mock presentation outlines based on topics
const presentationOutlines = {
  business: {
    title: "Business Presentation Structure",
    sections: [
      { id: 1, title: "Opening & Hook", duration: "2-3 min", content: "Start with a compelling question, statistic, or story to grab attention" },
      { id: 2, title: "Problem Statement", duration: "3-4 min", content: "Clearly define the challenge or opportunity you're addressing" },
      { id: 3, title: "Solution Overview", duration: "5-7 min", content: "Present your main solution or proposal with key benefits" },
      { id: 4, title: "Supporting Evidence", duration: "4-6 min", content: "Share data, case studies, or examples that support your solution" },
      { id: 5, title: "Implementation Plan", duration: "3-5 min", content: "Outline the steps, timeline, and resources needed" },
      { id: 6, title: "Q&A & Closing", duration: "5-8 min", content: "Address questions and end with a clear call to action" }
    ]
  },
  academic: {
    title: "Academic Presentation Structure",
    sections: [
      { id: 1, title: "Introduction", duration: "2-3 min", content: "Introduce yourself, topic, and presentation agenda" },
      { id: 2, title: "Literature Review", duration: "4-5 min", content: "Review relevant research and establish context" },
      { id: 3, title: "Methodology", duration: "3-4 min", content: "Explain your research approach and methods" },
      { id: 4, title: "Results & Findings", duration: "6-8 min", content: "Present your key findings with visual aids" },
      { id: 5, title: "Discussion", duration: "4-6 min", content: "Interpret results and discuss implications" },
      { id: 6, title: "Conclusion", duration: "2-3 min", content: "Summarize key points and suggest future research" }
    ]
  },
  sales: {
    title: "Sales Presentation Structure",
    sections: [
      { id: 1, title: "Rapport Building", duration: "2-3 min", content: "Connect with your audience and establish credibility" },
      { id: 2, title: "Needs Discovery", duration: "3-4 min", content: "Understand and acknowledge customer pain points" },
      { id: 3, title: "Product Demo", duration: "8-10 min", content: "Showcase how your product solves their specific problems" },
      { id: 4, title: "Value Proposition", duration: "4-5 min", content: "Clearly articulate the ROI and benefits" },
      { id: 5, title: "Objection Handling", duration: "3-5 min", content: "Address concerns and remove barriers to purchase" },
      { id: 6, title: "Closing", duration: "2-3 min", content: "Ask for the sale and outline next steps" }
    ]
  },
  creative: {
    title: "Creative Presentation Structure",
    sections: [
      { id: 1, title: "Creative Hook", duration: "1-2 min", content: "Start with an unexpected visual, story, or interactive element" },
      { id: 2, title: "Vision Statement", duration: "3-4 min", content: "Paint a picture of your creative vision or concept" },
      { id: 3, title: "Creative Process", duration: "5-7 min", content: "Walk through your creative journey and inspiration" },
      { id: 4, title: "Showcase", duration: "8-12 min", content: "Present your work with emphasis on storytelling" },
      { id: 5, title: "Impact & Meaning", duration: "3-4 min", content: "Explain the deeper meaning and intended impact" },
      { id: 6, title: "Interactive Close", duration: "3-5 min", content: "Engage audience with questions or collaborative activity" }
    ]
  }
};

const Presenter = () => {
  const navigate = useNavigate();
  
  // State management
  const [step, setStep] = useState('setup'); // setup -> outline -> practice -> feedback
  const [presentationData, setPresentationData] = useState({
    topic: '',
    audience: '',
    duration: 15,
    type: 'business',
    objectives: ''
  });
  
  // Timer states
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const chunksRef = useRef([]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Timer functions
  const startTimer = () => {
    setIsTimerRunning(true);
    setIsPaused(false);
    timerIntervalRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    clearInterval(timerIntervalRef.current);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    timerIntervalRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setIsPaused(false);
    clearInterval(timerIntervalRef.current);
  };

  const resetTimer = () => {
    setTimeElapsed(0);
    setIsTimerRunning(false);
    setIsPaused(false);
    clearInterval(timerIntervalRef.current);
  };

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const newRecording = {
          id: Date.now(),
          blob: blob,
          duration: timeElapsed,
          timestamp: new Date().toLocaleTimeString(),
          url: URL.createObjectURL(blob)
        };
        setRecordings(prev => [...prev, newRecording]);
        setCurrentRecording(newRecording);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = (recording) => {
    if (audioRef.current) {
      audioRef.current.src = recording.url;
      audioRef.current.play();
      setIsPlaying(true);
      setCurrentRecording(recording);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
      recordings.forEach(recording => {
        URL.revokeObjectURL(recording.url);
      });
    };
  }, [recordings]);

  // Step 1: Setup Form
  const SetupForm = () => {
    const [localData, setLocalData] = useState(presentationData);

    const handleNext = () => {
      setPresentationData(localData);
      setStep('outline');
    };

    const handleInputChange = (field, value) => {
      setLocalData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Presentation Setup</h1>
          <p className="text-slate-600 text-sm sm:text-base">Configure your presentation practice session</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Presentation Topic</label>
              <input
                type="text"
                value={localData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g., Q4 Sales Review, Product Launch, Research Findings"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Presentation Type</label>
              <select
                value={localData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="business">Business Presentation</option>
                <option value="academic">Academic Presentation</option>
                <option value="sales">Sales Pitch</option>
                <option value="creative">Creative Showcase</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Audience</label>
              <input
                type="text"
                value={localData.audience}
                onChange={(e) => handleInputChange('audience', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g., Senior Management, Clients, Peers, Students"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
              <select
                value={localData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Key Objectives</label>
              <textarea
                value={localData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                className="w-full h-24 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                placeholder="What do you want to achieve with this presentation?"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center justify-center px-6 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              View Outline
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step 2: Outline Display
  const OutlineDisplay = () => {
    const outline = presentationOutlines[presentationData.type];
    const totalDuration = outline.sections.reduce((acc, section) => {
      const avg = section.duration.split('-').map(d => parseInt(d.split(' ')[0])).reduce((a, b) => a + b) / 2;
      return acc + avg;
    }, 0);

    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Presentation Outline</h1>
          <p className="text-slate-600 text-sm sm:text-base">Your customized presentation structure</p>
        </div>

        {/* Presentation Info */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm text-slate-600">Topic</div>
              <div className="font-medium text-slate-900">{presentationData.topic || 'Not specified'}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-sm text-slate-600">Audience</div>
              <div className="font-medium text-slate-900">{presentationData.audience || 'Not specified'}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm text-slate-600">Duration</div>
              <div className="font-medium text-slate-900">{presentationData.duration} minutes</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-sm text-slate-600">Estimated</div>
              <div className="font-medium text-slate-900">{Math.round(totalDuration)} min outline</div>
            </div>
          </div>
        </div>

        {/* Outline Sections */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">{outline.title}</h3>
          <div className="space-y-4">
            {outline.sections.map((section, index) => (
              <div key={section.id} className="border border-slate-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{section.title}</h4>
                      <div className="text-sm text-slate-600">{section.duration}</div>
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 text-sm sm:text-base ml-11">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => setStep('setup')}
            className="flex items-center justify-center px-6 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Setup
          </button>
          <button
            onClick={() => setStep('practice')}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Start Practice
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  };

  // Step 3: Practice Session
  const PracticeSession = () => {
    const targetDuration = presentationData.duration * 60; // Convert to seconds
    const progressPercentage = Math.min((timeElapsed / targetDuration) * 100, 100);

    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Practice Session</h1>
          <p className="text-slate-600 text-sm sm:text-base">Practice your presentation with timer and recording</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Timer & Controls */}
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Practice Timer</h3>
              
              {/* Timer Display */}
              <div className="relative mb-6">
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
                    <div className="text-sm text-slate-600">
                      / {formatTime(targetDuration)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {!isTimerRunning && timeElapsed === 0 && (
                  <button
                    onClick={startTimer}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </button>
                )}
                
                {isTimerRunning && !isPaused && (
                  <button
                    onClick={pauseTimer}
                    className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </button>
                )}
                
                {isPaused && (
                  <button
                    onClick={resumeTimer}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </button>
                )}
                
                {(isTimerRunning || isPaused) && (
                  <button
                    onClick={stopTimer}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </button>
                )}
                
                {timeElapsed > 0 && !isTimerRunning && (
                  <button
                    onClick={resetTimer}
                    className="flex items-center px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm sm:text-base"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </button>
                )}
              </div>

              {/* Progress Info */}
              <div className="text-sm text-slate-600">
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

            {/* Recording Controls */}
            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-base font-semibold text-slate-900 mb-4">🎤 Recording</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center justify-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base animate-pulse"
                  >
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Recording
                  </button>
                )}
              </div>
              
              {isRecording && (
                <div className="mt-4 flex items-center justify-center text-red-600">
                  <div className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium">Recording in progress...</span>
                </div>
              )}
            </div>
          </div>

          {/* Recordings & Playback */}
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Recordings</h3>
            
            {recordings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-lg font-medium text-slate-900 mb-2">No recordings yet</h4>
                <p className="text-slate-600 text-sm">Start your first recording to practice your presentation.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recordings.map((recording, index) => (
                  <div key={recording.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-slate-900">Recording #{index + 1}</h4>
                        <div className="text-sm text-slate-600">
                          {recording.timestamp} • {formatTime(recording.duration)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => isPlaying && currentRecording?.id === recording.id ? pausePlayback() : playRecording(recording)}
                          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          {isPlaying && currentRecording?.id === recording.id ? (
                            <>
                              <Pause className="w-4 h-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-1" />
                              Play
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = recording.url;
                            a.download = `presentation-recording-${index + 1}.wav`;
                            a.click();
                          }}
                          className="flex items-center px-3 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {isPlaying && currentRecording?.id === recording.id && (
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-1/3 transition-all duration-300"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Hidden audio element */}
            <audio ref={audioRef} style={{ display: 'none' }} />
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => setStep('outline')}
            className="flex items-center justify-center px-6 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Outline
          </button>
          <button
            onClick={() => setStep('feedback')}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            View Feedback
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  };

  // Step 4: Feedback Summary
  const FeedbackSummary = () => {
    const targetDuration = presentationData.duration * 60;
    const timeVariance = timeElapsed - targetDuration;
    const timePercentage = (timeElapsed / targetDuration) * 100;
    
    // Generate feedback based on performance
    const generateFeedback = () => {
      const feedback = {
        timing: {
          score: timePercentage > 120 ? 60 : timePercentage < 80 ? 70 : 90,
          message: timePercentage > 120 
            ? "Your presentation ran over time. Consider practicing with a stricter time limit."
            : timePercentage < 80 
            ? "Your presentation was shorter than planned. You might want to add more content or slow down."
            : "Good timing! You stayed close to your target duration."
        },
        preparation: {
          score: recordings.length > 0 ? 85 : 60,
          message: recordings.length > 0 
            ? `Great job practicing! You made ${recordings.length} recording${recordings.length > 1 ? 's' : ''}.`
            : "Consider recording yourself to better evaluate your delivery and speaking pace."
        },
        overall: recordings.length > 0 && Math.abs(timeVariance) < 120 ? 88 : 75
      };
      return feedback;
    };

    const feedback = generateFeedback();

    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Practice Feedback</h1>
          <p className="text-slate-600 text-sm sm:text-base">Review your presentation practice session</p>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200 mb-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
              <circle
                cx="50" cy="50" r="40"
                stroke="#10b981" strokeWidth="8" fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - feedback.overall / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{feedback.overall}</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Overall Score</h3>
          <p className="text-slate-600">
            {feedback.overall >= 85 ? "Excellent practice session!" : 
             feedback.overall >= 75 ? "Good practice session!" : 
             "Keep practicing to improve!"}
          </p>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Timing Analysis */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Timing</h3>
                <div className="text-sm text-slate-600">Score: {feedback.timing.score}/100</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Target Duration:</span>
                <span className="font-medium">{formatTime(targetDuration)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Actual Duration:</span>
                <span className="font-medium">{formatTime(timeElapsed)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Variance:</span>
                <span className={`font-medium ${timeVariance > 0 ? 'text-red-600' : timeVariance < -120 ? 'text-orange-600' : 'text-green-600'}`}>
                  {timeVariance > 0 ? '+' : ''}{formatTime(Math.abs(timeVariance))}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4">{feedback.timing.message}</p>
          </div>

          {/* Recording Analysis */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Mic className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Practice Quality</h3>
                <div className="text-sm text-slate-600">Score: {feedback.preparation.score}/100</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Recordings Made:</span>
                <span className="font-medium">{recordings.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Practice Sessions:</span>
                <span className="font-medium">1</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Outline Reviewed:</span>
                <span className="font-medium text-green-600">✓ Yes</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4">{feedback.preparation.message}</p>
          </div>
        </div>

        {/* Session Summary */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Session Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-slate-600">Topic</div>
              <div className="font-medium text-slate-900">{presentationData.topic || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Type</div>
              <div className="font-medium text-slate-900 capitalize">{presentationData.type}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Audience</div>
              <div className="font-medium text-slate-900">{presentationData.audience || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Date</div>
              <div className="font-medium text-slate-900">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-8 border border-blue-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">💡 Recommendations</h3>
          <div className="space-y-3">
            {timePercentage > 120 && (
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-slate-700 text-sm">Practice with a timer to stay within your allocated time slot.</p>
              </div>
            )}
            {timePercentage < 80 && (
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-slate-700 text-sm">Consider adding more content or speaking more slowly to fill your time slot.</p>
              </div>
            )}
            {recordings.length === 0 && (
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-slate-700 text-sm">Record yourself practicing to identify areas for improvement in delivery and pacing.</p>
              </div>
            )}
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-slate-700 text-sm">Practice your opening and closing multiple times - these are the most memorable parts.</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-slate-700 text-sm">Consider practicing in front of a mirror or with friends for additional feedback.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <button
            onClick={() => {
              resetTimer();
              setRecordings([]);
              setCurrentRecording(null);
              setStep('practice');
            }}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Practice Again
          </button>
          <button
            onClick={() => {
              setPresentationData({
                topic: '',
                audience: '',
                duration: 15,
                type: 'business',
                objectives: ''
              });
              resetTimer();
              setRecordings([]);
              setCurrentRecording(null);
              setStep('setup');
            }}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            New Presentation
          </button>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center justify-center px-6 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
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
      {/* Header - Matching Dashboard Style */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - clickable to dashboard */}
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

            {/* Back to Dashboard Button */}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {step === 'setup' && <SetupForm />}
        {step === 'outline' && <OutlineDisplay />}
        {step === 'practice' && <PracticeSession />}
        {step === 'feedback' && <FeedbackSummary />}
      </main>
    </div>
  );
};

export default Presenter;