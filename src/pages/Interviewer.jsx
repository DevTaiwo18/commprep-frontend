import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Target, Star, CheckCircle, ArrowRight, Lightbulb, ThumbsUp } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const QuestionInput = React.memo(({ value, onChange, placeholder }) => (
  <textarea
    value={value}
    onChange={onChange}
    className="w-full h-32 px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 resize-none text-base sm:text-lg"
    placeholder={placeholder}
  />
));

const Interviewer = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('dashboard');
  const [interviewType, setInterviewType] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionsAsked, setQuestionsAsked] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const interviewTypes = useMemo(() => [
    { id: 'technical', title: 'Technical Interview', icon: '💻', description: 'Coding and technical skills' },
    { id: 'behavioral', title: 'Behavioral Interview', icon: '🧠', description: 'Soft skills and experience' },
    { id: 'system-design', title: 'System Design', icon: '🏗️', description: 'Architecture and design' },
    { id: 'cultural', title: 'Cultural Fit', icon: '🤝', description: 'Team fit and values' }
  ], []);

  const sampleQuestions = useMemo(() => ({
    technical: [
      "Explain the difference between REST and GraphQL",
      "How would you optimize a slow database query?",
      "What is your approach to testing code?"
    ],
    behavioral: [
      "Tell me about a time you had to learn something new quickly",
      "Describe a challenging project you worked on",
      "How do you handle constructive criticism?"
    ],
    'system-design': [
      "Design a URL shortening service like bit.ly",
      "How would you design a chat application?",
      "Design a notification system for a mobile app"
    ],
    cultural: [
      "What motivates you in your work?",
      "How do you prefer to receive feedback?",
      "What does good teamwork look like to you?"
    ]
  }), []);

  const handleQuestionChange = useCallback((e) => {
    setQuestionText(e.target.value);
  }, []);

  const generateFeedback = useCallback((rating) => {
    const feedbacks = {
      excellent: [
        "Excellent question! This will reveal deep insights about the candidate.",
        "Perfect! This question tests exactly what you need to know.",
        "Outstanding! This will help you understand their problem-solving approach.",
        "Brilliant question! This covers both technical skills and thinking process."
      ],
      good: [
        "Good question! Consider adding a follow-up for more depth.",
        "Nice! This will give you solid insights about the candidate.",
        "Great question! You could make it more specific to your role.",
        "Well done! This covers the key areas you need to assess."
      ],
      okay: [
        "Decent question. Try to make it more specific to the role.",
        "Good start! Consider what specific skills you want to test.",
        "Not bad! Think about what the ideal answer would reveal."
      ]
    };
    
    if (rating >= 90) return feedbacks.excellent[Math.floor(Math.random() * feedbacks.excellent.length)];
    if (rating >= 80) return feedbacks.good[Math.floor(Math.random() * feedbacks.good.length)];
    return feedbacks.okay[Math.floor(Math.random() * feedbacks.okay.length)];
  }, []);

  const rateQuestion = useCallback(() => {
    const rating = Math.floor(Math.random() * 20) + 80;
    const feedback = generateFeedback(rating);
    
    const ratedQuestion = {
      text: questionText,
      type: interviewType,
      rating: rating,
      feedback: feedback,
      timestamp: new Date()
    };
    
    setQuestionsAsked(prev => [...prev, ratedQuestion]);
    setQuestionText('');
  }, [questionText, interviewType, generateFeedback]);

  const Dashboard = useMemo(() => (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Interviewer Practice</h1>
        <p className="text-lg sm:text-xl text-slate-600">Master the art of creating great interview questions! 🎯</p>
      </div>

      <div className="flex justify-center px-4">
        <button
          onClick={() => {
            setStep('setup');
            setStartTime(new Date());
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-xl transform hover:scale-105"
        >
          <div className="text-center">
            <Target className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Start Practice Session</h3>
            <p className="text-blue-100 text-sm sm:text-base">Create and rate interview questions</p>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center mx-4 sm:mx-0">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">How It Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">1️⃣</div>
            <h4 className="font-bold text-slate-900 mb-2">Choose Type</h4>
            <p className="text-slate-600 text-sm sm:text-base">Pick your interview style</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">2️⃣</div>
            <h4 className="font-bold text-slate-900 mb-2">Create Questions</h4>
            <p className="text-slate-600 text-sm sm:text-base">Type your questions and get instant feedback</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">3️⃣</div>
            <h4 className="font-bold text-slate-900 mb-2">Get Rated</h4>
            <p className="text-slate-600 text-sm sm:text-base">See your scores and improve</p>
          </div>
        </div>
      </div>
    </div>
  ), []);

  const PracticeSetup = useMemo(() => (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Choose Interview Type</h1>
        <p className="text-lg sm:text-xl text-slate-600">What kind of questions do you want to practice? 🎯</p>
      </div>
      
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {interviewTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => {
                setInterviewType(type.id);
                setStep('practice');
              }}
              className="p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg"
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{type.icon}</div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">{type.title}</h4>
                <p className="text-slate-600 text-sm sm:text-base">{type.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-slate-600 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back
          </button>
        </div>
      </div>
    </div>
  ), [interviewTypes, handleBackToDashboard]);

  const PracticeSession = useMemo(() => {
    const selectedType = interviewTypes.find(t => t.id === interviewType);
    const sampleQs = sampleQuestions[interviewType] || [];
    
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Question Practice Studio</h1>
          <p className="text-slate-600 text-sm sm:text-base">Creating questions for: <span className="font-bold text-blue-600">{selectedType?.title}</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-200">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 inline mr-2 text-yellow-500" />
                Create Your Question
              </h3>
              
              <div className="mb-4 sm:mb-6">
                <label className="block text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
                  What question would you ask a candidate?
                </label>
                <QuestionInput
                  value={questionText}
                  onChange={handleQuestionChange}
                  placeholder="Type your interview question here..."
                />
                <div className="text-sm text-slate-500 mt-2">
                  {questionText.length} characters
                </div>
              </div>

              <button
                onClick={rateQuestion}
                disabled={!questionText.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <Star className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                Rate My Question!
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-3 sm:mb-4 text-sm sm:text-base">💡 Question Examples</h4>
              <div className="space-y-2 sm:space-y-3">
                {sampleQs.map((question, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 sm:p-3 border border-blue-200">
                    <p className="text-xs sm:text-sm text-slate-700">"{question}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-3 sm:mb-4 text-sm sm:text-base">🎯 Progress</h4>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{questionsAsked.length}</div>
                <div className="text-slate-600 text-sm sm:text-base">Questions Created</div>
              </div>
            </div>
          </div>
        </div>

        {questionsAsked.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-200">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Your Recent Questions & Ratings</h3>
            <div className="space-y-3 sm:space-y-4">
              {questionsAsked.slice(-3).reverse().map((q, index) => (
                <div key={index} className="border-2 border-slate-200 rounded-xl p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-3">
                    <p className="text-slate-800 font-medium flex-1 pr-0 sm:pr-4 mb-2 sm:mb-0 text-sm sm:text-base">"{q.text}"</p>
                    <div className="text-left sm:text-right">
                      <div className={`text-xl sm:text-2xl font-bold mb-1 ${
                        q.rating >= 90 ? 'text-green-600' : 
                        q.rating >= 80 ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {q.rating}/100
                      </div>
                      <div className="flex items-center">
                        {q.rating >= 90 ? <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-1" /> : 
                         q.rating >= 80 ? <Star className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-1" /> : 
                         <Target className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 mr-1" />}
                        <span className="text-xs sm:text-sm text-slate-600">
                          {q.rating >= 90 ? 'Excellent!' : q.rating >= 80 ? 'Great!' : 'Good!'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-2 sm:p-3 border border-green-200">
                    <p className="text-xs sm:text-sm text-slate-700 italic">💬 {q.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-slate-600 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back
          </button>
          {questionsAsked.length >= 5 && (
            <button
              onClick={() => setStep('summary')}
              className="flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all shadow-lg text-sm sm:text-base"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Complete Session
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    );
  }, [interviewTypes, interviewType, sampleQuestions, questionText, handleQuestionChange, rateQuestion, questionsAsked, handleBackToDashboard]);

  const PracticeSummary = () => {
    const saveAttempted = React.useRef(false);
    const averageScore = questionsAsked.length > 0 
      ? Math.round(questionsAsked.reduce((sum, q) => sum + q.rating, 0) / questionsAsked.length)
      : 0;

    useEffect(() => {
      const saveSession = async () => {
        if (saveAttempted.current || !startTime || questionsAsked.length === 0) return;
        
        saveAttempted.current = true;

        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const endTime = new Date();
          const durationMinutes = Math.max(1, Math.round((endTime - startTime) / (1000 * 60)));

          const sessionData = {
            type: "interviewer",
            title: `Interviewer Practice - ${interviewTypes.find(t => t.id === interviewType)?.title}`,
            context: { 
              interviewType: interviewType,
              questionsCreated: questionsAsked.length,
              averageRating: averageScore
            },
            questions: questionsAsked.map(q => q.text),
            answers: questionsAsked.map(q => `Rating: ${q.rating}/100 - ${q.feedback}`),
            completedAt: endTime.toISOString(),
            duration: durationMinutes,
            score: averageScore
          };

          await fetch(`${API_BASE_URL}/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(sessionData)
          });
        } catch (error) {
          // Silent fail
        }
      };

      saveSession();
    }, []);

    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Great Job! 🎉</h1>
          <p className="text-lg sm:text-xl text-slate-600">You've mastered the art of creating interview questions!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{questionsAsked.length}</div>
            <div className="text-blue-100 text-sm sm:text-base">Questions Created</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{averageScore}/100</div>
            <div className="text-green-100 text-sm sm:text-base">Average Score</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{interviewTypes.find(t => t.id === interviewType)?.icon}</div>
            <div className="text-purple-100 text-sm sm:text-base">{interviewTypes.find(t => t.id === interviewType)?.title}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-green-200 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">🚀 You're Ready to Interview!</h3>
          <p className="text-slate-700 mb-3 sm:mb-4 text-sm sm:text-base">
            {averageScore >= 90 
              ? "Outstanding! You've created excellent questions that will help you find the best candidates."
              : averageScore >= 85
              ? "Great work! Your questions show strong interviewing skills and will be effective in assessments."
              : "Good job! You're developing solid question-creation skills. Keep practicing to become even better!"
            }
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => {
              setQuestionsAsked([]);
              setQuestionText('');
              setInterviewType('');
              setStep('dashboard');
              setStartTime(null);
            }}
            className="flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all shadow-lg text-sm sm:text-base"
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Practice Again
          </button>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center justify-center px-6 sm:px-8 py-2 sm:py-3 text-slate-600 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div 
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CommPrep
              </span>
            </div>

            <button
              onClick={handleBackToDashboard}
              className="flex items-center px-3 sm:px-4 py-1 sm:py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {step === 'dashboard' && Dashboard}
        {step === 'setup' && PracticeSetup}
        {step === 'practice' && PracticeSession}
        {step === 'summary' && <PracticeSummary />}
      </main>
    </div>
  );
};

export default Interviewer;