import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MessageCircle, Users, Presentation, Calendar, ArrowRight, Play, Mic, Brain, Target } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Interview Preparation",
      description: "Practice with AI-generated questions tailored to your field",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "For Interviewers",
      description: "Create structured interview templates and evaluation tools",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Presentation className="w-6 h-6" />,
      title: "Presentation Practice",
      description: "Get feedback on your delivery and presentation style",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Meeting Preparation",
      description: "Generate talking points and practice for important meetings",
      color: "from-orange-500 to-red-500"
    }
  ];

  const benefits = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Feedback",
      description: "Get intelligent insights on your communication style and areas for improvement"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice & Text Practice",
      description: "Practice speaking out loud or typing responses - whatever works best for you"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Experience",
      description: "Customized practice sessions based on your role, industry, and goals"
    }
  ];

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CommPrep
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={handleSignIn}
                className="text-slate-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                Sign In
              </button>
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Get Started
              </button>
            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full text-sm hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className={`order-2 lg:order-1 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 sm:px-6 py-2 mb-6 sm:mb-8">
                <span className="text-xs sm:text-sm font-medium text-blue-800">✨ Your Personal Communication Assistant</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
                Practice & Perfect Your{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Communication
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                Get ready for interviews, presentations, and meetings with AI-powered practice sessions. Build confidence through personalized feedback and realistic scenarios.
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center text-sm sm:text-base"
                >
                  Start Practicing Free
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {/* Mobile Sign In Button */}
                <button 
                  onClick={handleSignIn}
                  className="md:hidden text-slate-600 hover:text-blue-600 transition-colors font-medium text-sm"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </div>
            
            <div className={`order-1 lg:order-2 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl sm:rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm sm:text-base">Practice Session Ready</div>
                        <div className="text-xs sm:text-sm text-slate-600">Software Engineer Interview</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <div className="text-xs sm:text-sm font-medium text-slate-900 mb-2">Next Question:</div>
                      <div className="text-xs sm:text-sm text-slate-700">
                        "Tell me about a challenging project you worked on and how you overcame obstacles."
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium hover:shadow-md transition-all text-xs sm:text-sm">
                        🎤 Voice Answer
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium hover:shadow-md transition-all text-xs sm:text-sm">
                        ✍️ Text Answer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose your practice mode and let AI help you improve your communication skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 ${
                  activeFeature === index ? 'ring-2 ring-blue-500/50' : ''
                }`}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CommPrep?
              </span>
            </h2>
            <p className="text-xl text-slate-600">One platform for all your communication needs</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl"></div>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-4">
              <span className="text-sm font-medium text-blue-800">✨ Complete communication toolkit</span>
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Everything you need to practice and improve your communication skills in one place. From job interviews to presentations, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-500 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 bg-cyan-500 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Get Started in{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-slate-600">Your journey to better communication starts here</p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Create Your Account</h3>
                <p className="text-slate-600 leading-relaxed">Sign up in seconds and get instant access to all practice modes</p>
              </div>
              
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Choose What to Practice</h3>
                <p className="text-slate-600 leading-relaxed">Select from interviews, presentations, meetings, or other communication scenarios</p>
              </div>
              
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Start Practicing & Get Feedback</h3>
                <p className="text-slate-600 leading-relaxed">Practice with AI-powered scenarios and receive instant feedback to improve</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Communication Confidence?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join CommPrep today and start practicing for your next big opportunity. It's free to get started!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Get Started Free
            </button>
            <button 
              onClick={handleSignIn}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-8 md:flex-row md:justify-between md:items-start md:space-y-0">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CommPrep</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-md mx-auto md:mx-0">
                Your personal communication and interview assistant. Practice, improve, and succeed with confidence.
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                &copy; 2025 CommPrep. All rights reserved.
              </p>
              <p className="text-slate-400 text-sm mt-2">
                Built with ❤️ for better communication
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;