import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Briefcase, MapPin, Star, ArrowRight, CheckCircle, RotateCcw, Save, Mic, MicOff, Play, Pause } from 'lucide-react';

// Simple question banks
const questions = {
  job: [
    "Tell me about yourself.",
    "Why do you want this job?",
    "What are your strengths?",
    "What are your weaknesses?",
    "Where do you see yourself in 5 years?",
    "Why should we hire you?",
    "Tell me about a challenge you overcame.",
    "What motivates you?"
  ],
  visa: [
    "What is the purpose of your visit?",
    "How long will you stay?",
    "How will you fund your trip?",
    "What ties do you have to your home country?",
    "Have you visited before?",
    "What is your occupation?",
    "Do you have family there?",
    "What will you do after your visit?"
  ],
  review: [
    "How was your performance this year?",
    "What were your biggest achievements?",
    "What are your goals for next year?",
    "Where can you improve?",
    "What new responsibilities do you want?",
    "How do you handle feedback?",
    "What skills do you want to develop?",
    "How do you contribute to the team?"
  ]
};

const Interviewee = () => {
  const navigate = useNavigate();
  
  // Simple state management
  const [step, setStep] = useState('type'); // type -> details -> practice -> summary
  const [interviewType, setInterviewType] = useState('');
  const [interviewDetails, setInterviewDetails] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const textareaRef = useRef(null);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
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

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Step 1: Choose Interview Type
  const TypeSelection = () => (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Choose Interview Type</h1>
        <p className="text-slate-600 text-sm sm:text-base">What kind of interview are you preparing for?</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div 
          onClick={() => { setInterviewType('job'); setStep('details'); }}
          className="bg-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer hover:shadow-lg transition-all border border-slate-200"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6">
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">Job Interview</h3>
          <p className="text-slate-600 text-sm sm:text-base">Practice for job applications and career opportunities</p>
        </div>

        <div 
          onClick={() => { setInterviewType('visa'); setStep('details'); }}
          className="bg-green-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer hover:shadow-lg transition-all border border-slate-200"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6">
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">Visa Interview</h3>
          <p className="text-slate-600 text-sm sm:text-base">Prepare for embassy and visa application interviews</p>
        </div>

        <div 
          onClick={() => { setInterviewType('review'); setStep('details'); }}
          className="bg-purple-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer hover:shadow-lg transition-all border border-slate-200 sm:col-span-2 lg:col-span-1"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6">
            <Star className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">Performance Review</h3>
          <p className="text-slate-600 text-sm sm:text-base">Practice for annual reviews and promotion discussions</p>
        </div>
      </div>
    </div>
  );

  // Step 2: Interview Details
  const DetailsForm = () => {
    const [localDetails, setLocalDetails] = useState(interviewDetails);

    const handleNext = () => {
      setInterviewDetails(localDetails);
      setStep('practice');
    };

    const handleInputChange = (field, value) => {
      setLocalDetails(prev => ({
        ...prev,
        [field]: value
      }));
    };

    return (
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Interview Details</h1>
          <p className="text-slate-600 text-sm sm:text-base">Tell us more to customize your practice</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="space-y-6">
            {interviewType === 'job' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={localDetails.jobTitle || ''}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="e.g., Software Engineer, Marketing Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={localDetails.company || ''}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="e.g., Google, Microsoft"
                  />
                </div>
              </>
            )}

            {interviewType === 'visa' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Destination Country</label>
                  <input
                    type="text"
                    value={localDetails.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="e.g., United States, Canada"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Purpose of Visit</label>
                  <select
                    value={localDetails.purpose || ''}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select purpose</option>
                    <option value="tourism">Tourism</option>
                    <option value="business">Business</option>
                    <option value="study">Study</option>
                    <option value="work">Work</option>
                  </select>
                </div>
              </>
            )}

            {interviewType === 'review' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Role</label>
                  <input
                    type="text"
                    value={localDetails.role || ''}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="e.g., Senior Developer, Marketing Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Review Type</label>
                  <select
                    value={localDetails.reviewType || ''}
                    onChange={(e) => handleInputChange('reviewType', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select type</option>
                    <option value="annual">Annual Review</option>
                    <option value="promotion">Promotion Discussion</option>
                    <option value="feedback">Feedback Session</option>
                  </select>
                </div>
              </>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
            <button
              onClick={() => setStep('type')}
              className="flex items-center justify-center px-6 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Start Practice
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step 3: Practice Interview
  const PracticeInterview = () => {
    const currentQuestions = questions[interviewType];
    const progress = ((currentQuestion + 1) / currentQuestions.length) * 100;

    const handleSaveAnswer = () => {
      setAnswers({
        ...answers,
        [currentQuestion]: currentAnswer
      });
      setCurrentAnswer('');
    };

    const handleNextQuestion = () => {
      if (currentQuestion < currentQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setStep('summary');
      }
    };

    const handlePreviousQuestion = () => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
        setCurrentAnswer(answers[currentQuestion - 1] || '');
      }
    };

    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Practice Interview</h1>
            <div className="text-sm text-slate-600">
              Question {currentQuestion + 1} of {currentQuestions.length}
            </div>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Question Section */}
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mr-3 sm:mr-4">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Interview Question</h3>
                <p className="text-xs sm:text-sm text-slate-600">Take your time to think and respond</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 sm:p-6 mb-6">
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed">
                {currentQuestions[currentQuestion]}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              <button
                onClick={() => setCurrentQuestion(Math.floor(Math.random() * currentQuestions.length))}
                className="flex items-center px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Random
              </button>
            </div>
          </div>

          {/* Answer Section */}
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mr-3 sm:mr-4">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Your Answer</h3>
                <p className="text-xs sm:text-sm text-slate-600">Practice speaking clearly and confidently</p>
              </div>
            </div>
            
            {/* Voice Recording Section */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-700 mb-3">🎤 Voice Practice</h4>
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 sm:p-6 border border-slate-200">
                
                {/* Recording Controls */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mb-4">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex items-center justify-center px-4 sm:px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                    >
                      <Mic className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex items-center justify-center px-4 sm:px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm text-sm sm:text-base"
                    >
                      <MicOff className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="mr-2">Stop Recording</span>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </button>
                  )}
                  
                  {audioBlob && (
                    <button
                      onClick={isPlaying ? pauseRecording : playRecording}
                      className="flex items-center justify-center px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          <span className="hidden sm:inline">Play Recording</span>
                          <span className="sm:hidden">Play</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Status Messages */}
                {isRecording && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm font-medium text-red-700">Recording your answer...</span>
                  </div>
                )}
                
                {audioBlob && !isRecording && (
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-3" />
                    <span className="text-sm text-green-700">Recording saved! You can play it back or record a new one.</span>
                  </div>
                )}
                
                {!isRecording && !audioBlob && (
                  <div className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                    💡 <strong>Tip:</strong> Record yourself answering to practice your delivery, tone, and confidence.
                  </div>
                )}
              </div>
            </div>

            {/* Text Answer Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">✍️ Written Answer</label>
              <textarea
                ref={textareaRef}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here... You can also use this space to take notes while practicing with voice recording."
                className="w-full h-32 sm:h-40 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder-slate-400 text-sm sm:text-base"
              />
              <div className="text-xs text-slate-500 mt-2">
                {currentAnswer.length} characters
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveAnswer}
                className="flex items-center justify-center px-4 sm:px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Answer
              </button>
              <button
                onClick={handleNextQuestion}
                className="flex items-center justify-center px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                {currentQuestion === currentQuestions.length - 1 ? 'Finish' : 'Next Question'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
            
            {/* Hidden audio element for playback */}
            <audio ref={audioRef} style={{ display: 'none' }} />
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => setStep('details')}
            className="flex items-center justify-center px-6 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </button>
          <button
            onClick={() => setStep('summary')}
            className="flex items-center justify-center px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm sm:text-base"
          >
            View Summary
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  };

  // Step 4: Summary
  const SummaryView = () => {
    const currentQuestions = questions[interviewType];
    const answeredQuestions = Object.keys(answers).length;
    const completionRate = Math.round((answeredQuestions / currentQuestions.length) * 100);

    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Practice Summary</h1>
          <p className="text-slate-600 text-sm sm:text-base">Review your responses and practice highlights</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{answeredQuestions}</div>
            <div className="text-slate-600 text-sm sm:text-base">Questions Answered</div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{completionRate}%</div>
            <div className="text-slate-600 text-sm sm:text-base">Completion Rate</div>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{currentQuestions.length}</div>
            <div className="text-slate-600 text-sm sm:text-base">Total Questions</div>
          </div>
        </div>

        {/* Interview Details */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Interview Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-slate-600">Type:</span>
              <p className="font-medium text-slate-900 capitalize text-sm sm:text-base">{interviewType} Interview</p>
            </div>
            {interviewDetails.jobTitle && (
              <div>
                <span className="text-sm text-slate-600">Position:</span>
                <p className="font-medium text-slate-900 text-sm sm:text-base">{interviewDetails.jobTitle}</p>
              </div>
            )}
            {interviewDetails.company && (
              <div>
                <span className="text-sm text-slate-600">Company:</span>
                <p className="font-medium text-slate-900 text-sm sm:text-base">{interviewDetails.company}</p>
              </div>
            )}
            {interviewDetails.country && (
              <div>
                <span className="text-sm text-slate-600">Country:</span>
                <p className="font-medium text-slate-900 text-sm sm:text-base">{interviewDetails.country}</p>
              </div>
            )}
            {interviewDetails.purpose && (
              <div>
                <span className="text-sm text-slate-600">Purpose:</span>
                <p className="font-medium text-slate-900 capitalize text-sm sm:text-base">{interviewDetails.purpose}</p>
              </div>
            )}
            {interviewDetails.role && (
              <div>
                <span className="text-sm text-slate-600">Role:</span>
                <p className="font-medium text-slate-900 text-sm sm:text-base">{interviewDetails.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Answered Questions */}
        {answeredQuestions > 0 && (
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">Your Responses</h3>
            <div className="space-y-6">
              {Object.entries(answers).map(([questionIndex, answer]) => (
                <div key={questionIndex} className="border-l-4 border-blue-500 pl-4 sm:pl-6">
                  <p className="font-medium text-slate-900 mb-2 text-sm sm:text-base">
                    {currentQuestions[parseInt(questionIndex)]}
                  </p>
                  <p className="text-slate-600 bg-slate-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                    {answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setCurrentAnswer('');
              setStep('practice');
            }}
            className="flex items-center justify-center px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Practice Again
          </button>
          <button
            onClick={() => {
              setStep('type');
              setInterviewType('');
              setInterviewDetails({});
              setAnswers({});
              setCurrentQuestion(0);
              setCurrentAnswer('');
            }}
            className="flex items-center justify-center px-4 sm:px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            New Interview
          </button>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center justify-center px-4 sm:px-6 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
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
        {step === 'type' && <TypeSelection />}
        {step === 'details' && <DetailsForm />}
        {step === 'practice' && <PracticeInterview />}
        {step === 'summary' && <SummaryView />}
      </main>
    </div>
  );
};

export default Interviewee;