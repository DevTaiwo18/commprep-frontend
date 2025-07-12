import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, ArrowRight, Plus, Edit3, Trash2, Save, Star, Clock, User, FileText, Search, Users, Target, Award, CheckCircle, Play, RotateCcw } from 'lucide-react';

// Mock data
const mockQuestions = [
  {
    id: 1,
    category: "Technical",
    difficulty: "Medium",
    question: "Explain the difference between SQL and NoSQL databases.",
    expectedAnswer: "SQL: structured, ACID compliant. NoSQL: flexible, scalable.",
    tags: ["databases", "backend"]
  },
  {
    id: 2,
    category: "Behavioral",
    difficulty: "Easy", 
    question: "Tell me about a time you worked with a difficult team member.",
    expectedAnswer: "Look for conflict resolution and communication skills.",
    tags: ["teamwork", "communication"]
  }
];

const mockCandidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Senior Software Engineer",
    email: "sarah@example.com",
    status: "Completed",
    date: "2024-01-15",
    score: 85,
    ratings: { technical: 4, communication: 4, problemSolving: 5, cultural: 4 },
    notes: "Strong technical background, excellent problem-solving skills.",
    recommendation: "Strong Hire"
  },
  {
    id: 2,
    name: "Michael Chen", 
    position: "Frontend Developer",
    email: "michael@example.com",
    status: "Scheduled",
    date: "2024-01-25",
    score: null,
    ratings: null,
    notes: "",
    recommendation: ""
  }
];

const Interviewer = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');
  const [questions, setQuestions] = useState(mockQuestions);
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Form states
  const [questionForm, setQuestionForm] = useState({
    category: 'Technical',
    difficulty: 'Medium', 
    question: '',
    expectedAnswer: '',
    tags: ''
  });

  const [candidateForm, setCandidateForm] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    scheduledDate: '',
    notes: ''
  });

  const [evaluationForm, setEvaluationForm] = useState({
    technical: 0,
    communication: 0,
    problemSolving: 0,
    cultural: 0,
    notes: '',
    recommendation: ''
  });

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Question management
  const addQuestion = () => {
    if (questionForm.question.trim()) {
      const newQuestion = {
        ...questionForm,
        id: Date.now(),
        tags: questionForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      setQuestions([...questions, newQuestion]);
      setQuestionForm({
        category: 'Technical',
        difficulty: 'Medium',
        question: '',
        expectedAnswer: '',
        tags: ''
      });
    }
  };

  // Candidate management
  const addCandidate = () => {
    if (candidateForm.name.trim()) {
      const newCandidate = {
        ...candidateForm,
        id: Date.now(),
        status: 'Scheduled',
        score: null,
        ratings: null,
        recommendation: ''
      };
      setCandidates([...candidates, newCandidate]);
      setCandidateForm({
        name: '',
        position: '',
        email: '',
        phone: '',
        scheduledDate: '',
        notes: ''
      });
    }
  };

  // Evaluation management
  const saveEvaluation = () => {
    if (selectedCandidate) {
      const overallScore = Math.round(
        (evaluationForm.technical + evaluationForm.communication + 
         evaluationForm.problemSolving + evaluationForm.cultural) * 5
      );
      
      setCandidates(candidates.map(c => 
        c.id === selectedCandidate.id 
          ? {
              ...c,
              status: 'Completed',
              score: overallScore,
              ratings: {
                technical: evaluationForm.technical,
                communication: evaluationForm.communication,
                problemSolving: evaluationForm.problemSolving,
                cultural: evaluationForm.cultural
              },
              notes: evaluationForm.notes,
              recommendation: evaluationForm.recommendation
            }
          : c
      ));
      
      setSelectedCandidate(null);
      setEvaluationForm({
        technical: 0,
        communication: 0,
        problemSolving: 0,
        cultural: 0,
        notes: '',
        recommendation: ''
      });
      setCurrentView('candidates');
    }
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Interviewer Dashboard</h1>
        <p className="text-slate-600">Manage interviews and candidate evaluations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{candidates.length}</div>
          <div className="text-sm text-slate-600">Total Candidates</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
          <div className="text-2xl font-bold text-green-600">
            {candidates.filter(c => c.status === 'Completed').length}
          </div>
          <div className="text-sm text-slate-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {candidates.filter(c => c.status === 'Scheduled').length}
          </div>
          <div className="text-sm text-slate-600">Scheduled</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
          <div className="text-2xl font-bold text-purple-600">{questions.length}</div>
          <div className="text-sm text-slate-600">Questions</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentView('questions')}
          className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-md transition-shadow text-left"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Question Bank</h3>
          <p className="text-sm text-slate-600">Create and manage interview questions</p>
        </button>

        <button
          onClick={() => setCurrentView('candidates')}
          className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-md transition-shadow text-left"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Candidates</h3>
          <p className="text-sm text-slate-600">Manage candidate records and evaluations</p>
        </button>

        <button
          onClick={() => setCurrentView('evaluation')}
          className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-md transition-shadow text-left"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Conduct Interview</h3>
          <p className="text-sm text-slate-600">Evaluate candidates and record ratings</p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Candidates</h3>
        <div className="space-y-3">
          {candidates.slice(0, 3).map(candidate => (
            <div key={candidate.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900">{candidate.name}</h4>
                <p className="text-sm text-slate-600">{candidate.position}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                candidate.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {candidate.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Question Template Component
  const QuestionTemplate = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Question Bank</h1>
        <p className="text-slate-600">Create and manage interview questions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Question Form */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Question</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={questionForm.category}
                  onChange={(e) => setQuestionForm({...questionForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="Technical">Technical</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Situational">Situational</option>
                  <option value="Cultural">Cultural Fit</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                <select
                  value={questionForm.difficulty}
                  onChange={(e) => setQuestionForm({...questionForm, difficulty: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Question</label>
              <textarea
                value={questionForm.question}
                onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                className="w-full h-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                placeholder="Enter the interview question..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Expected Answer</label>
              <textarea
                value={questionForm.expectedAnswer}
                onChange={(e) => setQuestionForm({...questionForm, expectedAnswer: e.target.value})}
                className="w-full h-16 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                placeholder="Key points to look for..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={questionForm.tags}
                onChange={(e) => setQuestionForm({...questionForm, tags: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="javascript, leadership, problem-solving"
              />
            </div>

            <button
              onClick={addQuestion}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Question Library</h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map(question => (
              <div key={question.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      question.category === 'Technical' ? 'bg-blue-100 text-blue-700' :
                      question.category === 'Behavioral' ? 'bg-green-100 text-green-700' :
                      question.category === 'Situational' ? 'bg-orange-100 text-orange-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {question.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => setQuestions(questions.filter(q => q.id !== question.id))}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-medium text-slate-900 text-sm mb-2">{question.question}</h4>
                {question.expectedAnswer && (
                  <p className="text-xs text-slate-600 mb-2">{question.expectedAnswer}</p>
                )}
                {question.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {question.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Candidate Records Component  
  const CandidateRecords = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Candidate Records</h1>
        <p className="text-slate-600">Manage candidate information and interviews</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Candidate Form */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Candidate</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={candidateForm.name}
                  onChange={(e) => setCandidateForm({...candidateForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
                <input
                  type="text"
                  value={candidateForm.position}
                  onChange={(e) => setCandidateForm({...candidateForm, position: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={candidateForm.email}
                  onChange={(e) => setCandidateForm({...candidateForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={candidateForm.phone}
                  onChange={(e) => setCandidateForm({...candidateForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Scheduled Date</label>
              <input
                type="date"
                value={candidateForm.scheduledDate}
                onChange={(e) => setCandidateForm({...candidateForm, scheduledDate: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
              <textarea
                value={candidateForm.notes}
                onChange={(e) => setCandidateForm({...candidateForm, notes: e.target.value})}
                className="w-full h-16 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                placeholder="Additional notes..."
              />
            </div>

            <button
              onClick={addCandidate}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Candidate
            </button>
          </div>
        </div>

        {/* Candidates List */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Candidate List</h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {candidates.map(candidate => (
              <div key={candidate.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-slate-900">{candidate.name}</h4>
                    <p className="text-sm text-slate-600">{candidate.position}</p>
                    <p className="text-xs text-slate-500">{candidate.email}</p>
                    {candidate.date && (
                      <p className="text-xs text-slate-500">Scheduled: {candidate.date}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      candidate.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      candidate.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {candidate.status}
                    </span>
                    {candidate.score && (
                      <div className="text-sm font-semibold text-slate-900 mt-1">
                        Score: {candidate.score}/100
                      </div>
                    )}
                  </div>
                </div>
                
                {candidate.ratings && (
                  <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                    <div>Technical: {candidate.ratings.technical}/5</div>
                    <div>Communication: {candidate.ratings.communication}/5</div>
                    <div>Problem Solving: {candidate.ratings.problemSolving}/5</div>
                    <div>Cultural Fit: {candidate.ratings.cultural}/5</div>
                  </div>
                )}

                {candidate.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded mb-2">{candidate.notes}</p>
                )}

                {candidate.recommendation && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    candidate.recommendation === 'Strong Hire' ? 'bg-green-100 text-green-700' :
                    candidate.recommendation === 'Hire' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {candidate.recommendation}
                  </span>
                )}

                <div className="mt-3">
                  <button
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setCurrentView('evaluation');
                    }}
                    className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-medium"
                  >
                    {candidate.status === 'Completed' ? 'View Evaluation' : 'Start Interview'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Candidate Evaluation Component
  const CandidateEvaluation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Candidate Evaluation</h1>
        <p className="text-slate-600">Rate and evaluate candidate performance</p>
      </div>

      {!selectedCandidate ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Candidate Selected</h3>
          <p className="text-slate-600 mb-4">Please select a candidate from the candidates list to begin evaluation.</p>
          <button
            onClick={() => setCurrentView('candidates')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Candidates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Candidate Info */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Candidate Information</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-600">Name:</span>
                <p className="font-medium text-slate-900">{selectedCandidate.name}</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">Position:</span>
                <p className="font-medium text-slate-900">{selectedCandidate.position}</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">Email:</span>
                <p className="font-medium text-slate-900">{selectedCandidate.email}</p>
              </div>
              {selectedCandidate.date && (
                <div>
                  <span className="text-sm text-slate-600">Scheduled:</span>
                  <p className="font-medium text-slate-900">{selectedCandidate.date}</p>
                </div>
              )}
            </div>

            {/* Rating System */}
            <div className="mt-6">
              <h4 className="font-medium text-slate-900 mb-4">Rate Performance</h4>
              <div className="space-y-4">
                {[
                  { key: 'technical', label: 'Technical Skills' },
                  { key: 'communication', label: 'Communication' },
                  { key: 'problemSolving', label: 'Problem Solving' },
                  { key: 'cultural', label: 'Cultural Fit' }
                ].map(item => (
                  <div key={item.key}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{item.label}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setEvaluationForm({...evaluationForm, [item.key]: star})}
                          className={`w-8 h-8 rounded transition-colors ${
                            star <= evaluationForm[item.key]
                              ? 'bg-yellow-400 text-white'
                              : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                          }`}
                        >
                          <Star className="w-4 h-4 mx-auto" fill={star <= evaluationForm[item.key] ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes & Recommendation */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Interview Notes</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={evaluationForm.notes}
                  onChange={(e) => setEvaluationForm({...evaluationForm, notes: e.target.value})}
                  className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  placeholder="Record observations, responses, and key insights..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recommendation</label>
                <select
                  value={evaluationForm.recommendation}
                  onChange={(e) => setEvaluationForm({...evaluationForm, recommendation: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select recommendation</option>
                  <option value="Strong Hire">Strong Hire</option>
                  <option value="Hire">Hire</option>
                  <option value="Maybe">Maybe</option>
                  <option value="No Hire">No Hire</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  onClick={saveEvaluation}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Save Evaluation
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedCandidate(null);
                    setEvaluationForm({
                      technical: 0,
                      communication: 0,
                      problemSolving: 0,
                      cultural: 0,
                      notes: '',
                      recommendation: ''
                    });
                  }}
                  className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Navigation Tabs
  const NavigationTabs = () => (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-2">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'questions', label: 'Questions' },
            { id: 'candidates', label: 'Candidates' },
            { id: 'evaluation', label: 'Evaluation' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
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

            {/* Back Button */}
            <button
              onClick={handleBackToDashboard}
              className="flex items-center px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <NavigationTabs />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'questions' && <QuestionTemplate />}
        {currentView === 'candidates' && <CandidateRecords />}
        {currentView === 'evaluation' && <CandidateEvaluation />}
      </main>
    </div>
  );
};

export default Interviewer;