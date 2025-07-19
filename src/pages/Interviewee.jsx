import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Briefcase, MapPin, Star, ArrowRight } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const questions = {
  job: [
    "Tell me about yourself.",
    "Why do you want this job?",
    "What are your strengths?",
    "What are your weaknesses?",
    "Where do you see yourself in 5 years?",
    "Why should we hire you?",
    "Tell me about a challenge you overcame.",
    "What motivates you?",
    "Describe your ideal work environment.",
    "How do you handle stress and pressure?"
  ],
  visa: [
    "What is the purpose of your visit?",
    "How long will you stay?",
    "How will you fund your trip?",
    "What ties do you have to your home country?",
    "Have you visited before?",
    "What is your occupation?",
    "Do you have family there?",
    "What will you do after your visit?",
    "Why did you choose this specific destination?",
    "Do you have any criminal record?"
  ],
  review: [
    "How was your performance this year?",
    "What were your biggest achievements?",
    "What are your goals for next year?",
    "Where can you improve?",
    "What new responsibilities do you want?",
    "How do you handle feedback?",
    "What skills do you want to develop?",
    "How do you contribute to the team?",
    "What challenges did you face this year?",
    "How do you measure your success?"
  ]
};

const TypeSelection = ({ setInterviewType, setStep, setStartTime }) => (
  <div className="w-full max-w-4xl mx-auto px-4">
    <div className="text-center mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Choose Interview Type</h1>
      <p className="text-sm sm:text-base text-slate-600">What kind of interview are you preparing for?</p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div 
        onClick={() => { 
          setInterviewType('job'); 
          setStep('practice'); 
          setStartTime(new Date());
        }}
        className="bg-blue-50 rounded-xl p-6 sm:p-8 cursor-pointer hover:shadow-lg transition-all border border-slate-200"
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6">
          <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">Job Interview</h3>
        <p className="text-sm sm:text-base text-slate-600">Practice for job applications and career opportunities</p>
      </div>

      <div 
        onClick={() => { 
          setInterviewType('visa'); 
          setStep('practice'); 
          setStartTime(new Date());
        }}
        className="bg-green-50 rounded-xl p-6 sm:p-8 cursor-pointer hover:shadow-lg transition-all border border-slate-200"
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6">
          <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">Visa Interview</h3>
        <p className="text-sm sm:text-base text-slate-600">Prepare for embassy and visa application interviews</p>
      </div>

      <div 
        onClick={() => { 
          setInterviewType('review'); 
          setStep('practice'); 
          setStartTime(new Date());
        }}
        className="bg-purple-50 rounded-xl p-6 sm:p-8 cursor-pointer hover:shadow-lg transition-all border border-slate-200 sm:col-span-2 lg:col-span-1"
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6">
          <Star className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">Performance Review</h3>
        <p className="text-sm sm:text-base text-slate-600">Practice for annual reviews and promotion discussions</p>
      </div>
    </div>
  </div>
);

const PracticeInterview = ({ 
  interviewType, 
  currentQuestion, 
  setCurrentQuestion,
  answers,
  setAnswers,
  currentAnswer,
  setCurrentAnswer,
  setStep
}) => {
  const currentQuestions = questions[interviewType];
  const progress = ((currentQuestion + 1) / currentQuestions.length) * 100;

  const handleNextQuestion = () => {
    if (currentAnswer.trim()) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: currentAnswer.trim()
      }));
    }

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer('');
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
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
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

      <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm border border-slate-200 mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Interview Question</h3>
        <div className="bg-slate-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed">
            {currentQuestions[currentQuestion]}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2 inline" />
            Previous
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm border border-slate-200 mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Your Answer</h3>
        
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full h-32 sm:h-40 px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base text-slate-700 placeholder-slate-400"
        />
        <div className="text-xs text-slate-500 mt-2">
          {currentAnswer.length} characters
        </div>
        
        <div className="flex gap-3 mt-4 sm:mt-6">
          <button
            onClick={handleNextQuestion}
            className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            {currentAnswer.trim() ? 'Save & ' : ''}{currentQuestion === currentQuestions.length - 1 ? 'Finish' : 'Next Question'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <button
          onClick={() => setStep('type')}
          className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Types
        </button>
        <button
          onClick={() => setStep('summary')}
          className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm sm:text-base"
        >
          View Summary
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

const SummaryView = ({ 
  interviewType, 
  answers, 
  setStep, 
  setInterviewType,
  setAnswers,
  setCurrentQuestion,
  setCurrentAnswer,
  handleBackToDashboard,
  startTime
}) => {
  const currentQuestions = questions[interviewType];
  const answeredQuestions = Object.keys(answers).length;
  const completionRate = Math.round((answeredQuestions / currentQuestions.length) * 100);
  const [hasSaved, setHasSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

        const typeMapping = {
          'job': 'interview',
          'visa': 'interview', 
          'review': 'meeting'
        };

        const backendType = typeMapping[interviewType] || 'interview';
        
        const endTime = new Date();
        const durationMinutes = Math.max(1, Math.round((endTime - startTime) / (1000 * 60)));
        
        const totalQuestions = currentQuestions.length;
        const answeredQuestions = Object.keys(answers).length;
        const completionScore = Math.round((answeredQuestions / totalQuestions) * 100);

        const sessionData = {
          type: backendType,
          title: `${interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Practice Session`,
          context: { 
            originalType: interviewType,
            type: interviewType 
          },
          questions: currentQuestions,
          answers: Object.values(answers),
          completedAt: endTime,
          duration: durationMinutes,
          score: completionScore
        };

        console.log('Saving session with duration:', durationMinutes, 'minutes');

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
          console.log('Session saved successfully:', result);
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

    if (interviewType && Object.keys(answers).length > 0 && !hasSaved && !isSaving) {
      const timer = setTimeout(() => {
        saveSession();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [interviewType, answers, hasSaved, isSaving, startTime]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Practice Summary</h1>
        <p className="text-sm sm:text-base text-slate-600">Review your responses and practice highlights</p>
      </div>

      {/* Stats Grid - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{answeredQuestions}</div>
          <div className="text-sm sm:text-base text-slate-600">Questions Answered</div>
        </div>
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{completionRate}%</div>
          <div className="text-sm sm:text-base text-slate-600">Completion Rate</div>
        </div>
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-slate-200 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{currentQuestions.length}</div>
          <div className="text-sm sm:text-base text-slate-600">Total Questions</div>
        </div>
      </div>

      {answeredQuestions === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2">No Answers Recorded</h3>
          <p className="text-sm sm:text-base text-yellow-700 mb-4">
            You haven't saved any answers yet. Start practicing to build your interview skills!
          </p>
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setCurrentAnswer('');
              setStep('practice');
            }}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm sm:text-base"
          >
            Start Practicing Now
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm border border-slate-200 mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Interview Details</h3>
        <div>
          <span className="text-sm text-slate-600">Type:</span>
          <p className="font-medium text-slate-900 capitalize text-sm sm:text-base">{interviewType} Interview</p>
        </div>
      </div>

      {answeredQuestions > 0 && (
        <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm border border-slate-200 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6">Your Responses</h3>
          <div className="space-y-4 sm:space-y-6">
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

      {/* Action Buttons - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
        <button
          onClick={() => {
            setCurrentQuestion(0);
            setCurrentAnswer('');
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
          New Interview
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

const Interviewee = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState('type');
  const [interviewType, setInterviewType] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [startTime, setStartTime] = useState(null);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {step === 'type' && (
          <TypeSelection 
            setInterviewType={setInterviewType}
            setStep={setStep}
            setStartTime={setStartTime}
          />
        )}
        
        {step === 'practice' && (
          <PracticeInterview 
            interviewType={interviewType}
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            answers={answers}
            setAnswers={setAnswers}
            currentAnswer={currentAnswer}
            setCurrentAnswer={setCurrentAnswer}
            setStep={setStep}
          />
        )}
        
        {step === 'summary' && (
          <SummaryView 
            interviewType={interviewType}
            answers={answers}
            setStep={setStep}
            setInterviewType={setInterviewType}
            setAnswers={setAnswers}
            setCurrentQuestion={setCurrentQuestion}
            setCurrentAnswer={setCurrentAnswer}
            handleBackToDashboard={handleBackToDashboard}
            startTime={startTime}
          />
        )}
      </main>
    </div>
  );
};

export default Interviewee;