import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, ArrowRight, Users, Clock, Target, CheckCircle, Plus, Mic, MicOff, Play, Pause, Download, Volume2, Save, RotateCcw, FileText, Lightbulb, AlertCircle } from 'lucide-react';

// Meeting types and their templates
const meetingTypes = {
  standup: {
    title: "Daily Standup",
    description: "Quick team sync and progress updates",
    duration: 15,
    agenda: [
      { id: 1, item: "What did you accomplish yesterday?", duration: 3, type: "discussion" },
      { id: 2, item: "What are you working on today?", duration: 3, type: "discussion" },
      { id: 3, item: "Any blockers or impediments?", duration: 5, type: "problem-solving" },
      { id: 4, item: "Team announcements", duration: 2, type: "information" },
      { id: 5, item: "Next steps", duration: 2, type: "action" }
    ],
    talkingPoints: [
      "Keep updates brief and focused",
      "Mention specific deliverables and progress",
      "Identify blockers early",
      "Offer help to team members",
      "Stay on schedule"
    ]
  },
  oneOnOne: {
    title: "One-on-One Meeting",
    description: "Individual performance and development discussion",
    duration: 30,
    agenda: [
      { id: 1, item: "Check-in and recent wins", duration: 5, type: "discussion" },
      { id: 2, item: "Current project status", duration: 8, type: "review" },
      { id: 3, item: "Challenges and support needed", duration: 7, type: "problem-solving" },
      { id: 4, item: "Goals and development", duration: 7, type: "planning" },
      { id: 5, item: "Feedback and next steps", duration: 3, type: "action" }
    ],
    talkingPoints: [
      "Ask open-ended questions",
      "Listen actively and take notes",
      "Provide specific feedback",
      "Discuss career development",
      "Set clear action items"
    ]
  },
  presentation: {
    title: "Presentation Meeting",
    description: "Present ideas, proposals, or results to stakeholders",
    duration: 45,
    agenda: [
      { id: 1, item: "Welcome and introductions", duration: 5, type: "introduction" },
      { id: 2, item: "Agenda overview", duration: 2, type: "information" },
      { id: 3, item: "Main presentation", duration: 25, type: "presentation" },
      { id: 4, item: "Q&A session", duration: 10, type: "discussion" },
      { id: 5, item: "Next steps and follow-up", duration: 3, type: "action" }
    ],
    talkingPoints: [
      "Start with key takeaways",
      "Use data to support points",
      "Prepare for tough questions",
      "Keep slides visual and clear",
      "End with clear call to action"
    ]
  },
  brainstorm: {
    title: "Brainstorming Session",
    description: "Creative ideation and problem-solving meeting",
    duration: 60,
    agenda: [
      { id: 1, item: "Problem definition", duration: 10, type: "information" },
      { id: 2, item: "Individual ideation", duration: 15, type: "activity" },
      { id: 3, item: "Group sharing and building", duration: 20, type: "discussion" },
      { id: 4, item: "Idea evaluation and prioritization", duration: 10, type: "decision" },
      { id: 5, item: "Action planning", duration: 5, type: "action" }
    ],
    talkingPoints: [
      "Encourage wild ideas initially",
      "Build on others' suggestions",
      "Defer judgment during ideation",
      "Focus on quantity first",
      "Document all ideas"
    ]
  },
  client: {
    title: "Client Meeting",
    description: "External stakeholder or customer meeting",
    duration: 60,
    agenda: [
      { id: 1, item: "Relationship building", duration: 5, type: "introduction" },
      { id: 2, item: "Project status update", duration: 15, type: "review" },
      { id: 3, item: "Client feedback and concerns", duration: 15, type: "discussion" },
      { id: 4, item: "Future planning and opportunities", duration: 20, type: "planning" },
      { id: 5, item: "Action items and timeline", duration: 5, type: "action" }
    ],
    talkingPoints: [
      "Prepare status updates in advance",
      "Listen to client concerns actively",
      "Come with solutions, not just problems",
      "Document commitments clearly",
      "Follow up promptly after meeting"
    ]
  }
};

const MeetingPrep = () => {
  const navigate = useNavigate();
  
  // State management
  const [step, setStep] = useState('setup'); // setup -> agenda -> practice -> feedback
  const [meetingData, setMeetingData] = useState({
    title: '',
    type: 'standup',
    participants: '',
    duration: 15,
    objectives: '',
    customAgenda: [],
    notes: ''
  });
  
  // Practice states
  const [practiceMode, setPracticeMode] = useState('text'); // text or voice
  const [practiceNotes, setPracticeNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
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

  // Cleanup effect
  useEffect(() => {
    return () => {
      recordings.forEach(recording => {
        URL.revokeObjectURL(recording.url);
      });
    };
  }, [recordings]);

  // Step 1: Meeting Setup
  const MeetingSetup = () => {
    const [localData, setLocalData] = useState(meetingData);

    const handleNext = () => {
      setMeetingData(localData);
      setStep('agenda');
    };

    const handleInputChange = (field, value) => {
      setLocalData(prev => ({ ...prev, [field]: value }));
    };

    const handleTypeChange = (newType) => {
      setLocalData(prev => ({
        ...prev,
        type: newType,
        duration: meetingTypes[newType].duration
      }));
    };

    return (
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Meeting Setup</h1>
          <p className="text-slate-600 text-sm sm:text-base">Prepare for your upcoming meeting</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Meeting Title</label>
              <input
                type="text"
                value={localData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g., Weekly Team Sync, Project Review, Client Check-in"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Meeting Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(meetingTypes).map(([key, type]) => (
                  <div
                    key={key}
                    onClick={() => handleTypeChange(key)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      localData.type === key 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <h4 className="font-semibold text-slate-900 text-sm">{type.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{type.description}</p>
                    <div className="text-xs text-slate-500 mt-2">{type.duration} minutes</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Participants</label>
              <input
                type="text"
                value={localData.participants}
                onChange={(e) => handleInputChange('participants', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g., John, Sarah, Marketing Team, Client stakeholders"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
              <select
                value={localData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Meeting Objectives</label>
              <textarea
                value={localData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                className="w-full h-24 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                placeholder="What do you want to accomplish in this meeting?"
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
              Generate Agenda
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step 2: Agenda & Talking Points
  const AgendaPlanning = () => {
    const meetingTemplate = meetingTypes[meetingData.type];
    const [customAgenda, setCustomAgenda] = useState(meetingData.customAgenda.length > 0 ? meetingData.customAgenda : meetingTemplate.agenda);

    const handleNext = () => {
      setMeetingData(prev => ({ ...prev, customAgenda }));
      setStep('practice');
    };

    const addAgendaItem = () => {
      const newItem = {
        id: Date.now(),
        item: '',
        duration: 5,
        type: 'discussion'
      };
      setCustomAgenda(prev => [...prev, newItem]);
    };

    const updateAgendaItem = (id, field, value) => {
      setCustomAgenda(prev => 
        prev.map(item => 
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    };

    const removeAgendaItem = (id) => {
      setCustomAgenda(prev => prev.filter(item => item.id !== id));
    };

    const totalDuration = customAgenda.reduce((sum, item) => sum + item.duration, 0);

    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Meeting Agenda</h1>
          <p className="text-slate-600 text-sm sm:text-base">Review and customize your meeting structure</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Agenda Section */}
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Agenda Items</h3>
              <div className="text-sm text-slate-600">
                Total: {totalDuration} min
                {meetingData.duration && totalDuration > meetingData.duration && (
                  <span className="text-red-600 ml-2">
                    ({totalDuration - meetingData.duration} min over)
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {customAgenda.map((item, index) => (
                <div key={item.id} className="border border-slate-200 rounded-lg p-3 sm:p-4">
                  <div className="space-y-3">
                    {/* Header with number and remove button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-900">Agenda Item</span>
                      </div>
                      {customAgenda.length > 1 && (
                        <button
                          onClick={() => removeAgendaItem(item.id)}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    {/* Input field */}
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) => updateAgendaItem(item.id, 'item', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Enter agenda item description..."
                    />
                    
                    {/* Controls row */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-600 mb-1">Type</label>
                        <select
                          value={item.type}
                          onChange={(e) => updateAgendaItem(item.id, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="discussion">Discussion</option>
                          <option value="presentation">Presentation</option>
                          <option value="decision">Decision</option>
                          <option value="information">Information</option>
                          <option value="action">Action Items</option>
                          <option value="review">Review</option>
                        </select>
                      </div>
                      <div className="w-full sm:w-32">
                        <label className="block text-xs text-slate-600 mb-1">Duration</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={item.duration}
                            onChange={(e) => updateAgendaItem(item.id, 'duration', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500"
                            min="1"
                            max="60"
                          />
                          <span className="text-xs text-slate-600 whitespace-nowrap">min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addAgendaItem}
              className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Agenda Item
            </button>
          </div>

          {/* Talking Points Section */}
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Key Talking Points</h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2 text-blue-600" />
                  Tips for {meetingTemplate.title}
                </h4>
                <ul className="space-y-2">
                  {meetingTemplate.talkingPoints.map((point, index) => (
                    <li key={index} className="text-sm text-slate-700 flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                  Questions to Prepare
                </h4>
                <div className="space-y-2 text-sm text-slate-700">
                  <div>• What are the key decisions that need to be made?</div>
                  <div>• Who needs to provide input or approval?</div>
                  <div>• What follow-up actions will be required?</div>
                  <div>• How will success be measured?</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
              <textarea
                value={meetingData.notes}
                onChange={(e) => setMeetingData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full h-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                placeholder="Add any specific notes, concerns, or preparation items..."
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => setStep('setup')}
            className="flex items-center justify-center px-6 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Setup
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
    );
  };

  // Step 3: Practice Session
  const PracticeSession = () => {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Practice Session</h1>
          <p className="text-slate-600 text-sm sm:text-base">Practice your talking points and prepare for the meeting</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Practice Mode Selection & Text Practice */}
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Practice Mode</h3>
            
            {/* Mode Selection */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setPracticeMode('text')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm ${
                  practiceMode === 'text' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Text Practice
              </button>
              <button
                onClick={() => setPracticeMode('voice')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm ${
                  practiceMode === 'voice' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Mic className="w-4 h-4 mr-2" />
                Voice Practice
              </button>
            </div>

            {practiceMode === 'text' ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Practice Your Key Points
                </label>
                <textarea
                  value={practiceNotes}
                  onChange={(e) => setPracticeNotes(e.target.value)}
                  className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  placeholder="Practice what you'll say... Try rehearsing your opening remarks, key points, and how you'll handle questions."
                />
                <div className="text-xs text-slate-500 mt-2">
                  {practiceNotes.length} characters
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      // Save notes to meetingData
                      setMeetingData(prev => ({ ...prev, practiceNotes }));
                    }}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Voice Recording Practice</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="flex items-center justify-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm animate-pulse"
                      >
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop Recording
                      </button>
                    )}
                  </div>
                  
                  {isRecording && (
                    <div className="mt-4 flex items-center text-red-600">
                      <div className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm font-medium">Recording your practice session...</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium text-slate-900 mb-2">💡 Voice Practice Tips</h5>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Practice your opening and closing remarks</li>
                    <li>• Rehearse difficult topics or sensitive discussions</li>
                    <li>• Work on clear, confident delivery</li>
                    <li>• Practice handling potential objections</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Agenda Reference & Recordings */}
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Meeting Reference</h3>
            
            {/* Quick Agenda Reference */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Agenda Overview</h4>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="space-y-2">
                  {(meetingData.customAgenda.length > 0 ? meetingData.customAgenda : meetingTypes[meetingData.type].agenda).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">{index + 1}. {item.item}</span>
                      <span className="text-slate-500">{item.duration}m</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recordings List */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Practice Recordings</h4>
              {recordings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Volume2 className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600">No recordings yet</p>
                  <p className="text-xs text-slate-500 mt-1">Switch to voice mode to start recording</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recordings.map((recording, index) => (
                    <div key={recording.id} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h5 className="text-sm font-medium text-slate-900">Practice #{index + 1}</h5>
                          <div className="text-xs text-slate-600">{recording.timestamp}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => isPlaying && currentRecording?.id === recording.id ? pausePlayback() : playRecording(recording)}
                            className="flex items-center px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                          >
                            {isPlaying && currentRecording?.id === recording.id ? (
                              <>
                                <Pause className="w-3 h-3 mr-1" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 mr-1" />
                                Play
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = recording.url;
                              a.download = `meeting-practice-${index + 1}.wav`;
                              a.click();
                            }}
                            className="flex items-center px-2 py-1 bg-slate-500 text-white rounded text-xs hover:bg-slate-600 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {isPlaying && currentRecording?.id === recording.id && (
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full w-1/3 transition-all duration-300"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Hidden audio element */}
            <audio ref={audioRef} style={{ display: 'none' }} />
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => setStep('agenda')}
            className="flex items-center justify-center px-6 py-3 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agenda
          </button>
          <button
            onClick={() => setStep('feedback')}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            View Summary
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  };

  // Step 4: Feedback & Summary
  const MeetingFeedback = () => {
    const meetingTemplate = meetingTypes[meetingData.type];
    const hasRecordings = recordings.length > 0;
    const hasPracticeNotes = practiceNotes.trim().length > 0;
    const preparationScore = (hasRecordings ? 40 : 0) + (hasPracticeNotes ? 30 : 0) + 30; // Base 30 for completing setup

    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Meeting Preparation Summary</h1>
          <p className="text-slate-600 text-sm sm:text-base">Review your preparation and get ready for success</p>
        </div>

        {/* Preparation Score */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200 mb-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
              <circle
                cx="50" cy="50" r="40"
                stroke="#10b981" strokeWidth="8" fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - preparationScore / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{preparationScore}</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Preparation Score</h3>
          <p className="text-slate-600">
            {preparationScore >= 85 ? "Excellent preparation!" : 
             preparationScore >= 70 ? "Good preparation!" : 
             "Consider more practice for better results"}
          </p>
        </div>

        {/* Meeting Overview */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Meeting Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-slate-600">Title</div>
              <div className="font-medium text-slate-900">{meetingData.title || 'Not specified'}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Type</div>
              <div className="font-medium text-slate-900">{meetingTemplate.title}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Duration</div>
              <div className="font-medium text-slate-900">{meetingData.duration} minutes</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Participants</div>
              <div className="font-medium text-slate-900">{meetingData.participants || 'Not specified'}</div>
            </div>
          </div>
          {meetingData.objectives && (
            <div className="mt-4">
              <div className="text-sm text-slate-600">Objectives</div>
              <div className="text-slate-900">{meetingData.objectives}</div>
            </div>
          )}
        </div>

        {/* Final Agenda */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Final Agenda</h3>
          <div className="space-y-3">
            {(meetingData.customAgenda.length > 0 ? meetingData.customAgenda : meetingTemplate.agenda).map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 text-sm">{item.item}</div>
                    <div className="text-xs text-slate-600 capitalize">{item.type}</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600">{item.duration} min</div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Text Practice</h3>
                <div className="text-sm text-slate-600">
                  {hasPracticeNotes ? 'Completed' : 'Not completed'}
                </div>
              </div>
            </div>
            {hasPracticeNotes ? (
              <div className="text-sm text-slate-600">
                ✓ Practice notes prepared ({practiceNotes.length} characters)
              </div>
            ) : (
              <div className="text-sm text-slate-500">
                Consider adding practice notes for better preparation
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Mic className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Voice Practice</h3>
                <div className="text-sm text-slate-600">
                  {hasRecordings ? `${recordings.length} recording${recordings.length > 1 ? 's' : ''}` : 'No recordings'}
                </div>
              </div>
            </div>
            {hasRecordings ? (
              <div className="text-sm text-slate-600">
                ✓ Voice practice completed - great preparation!
              </div>
            ) : (
              <div className="text-sm text-slate-500">
                Voice practice can help improve confidence and delivery
              </div>
            )}
          </div>
        </div>

        {/* Key Reminders */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-8 border border-blue-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">🎯 Key Reminders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Before the Meeting</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Test your technology (video, audio, screen sharing)</li>
                <li>• Review participant backgrounds and roles</li>
                <li>• Prepare any necessary documents or materials</li>
                <li>• Arrive 2-3 minutes early</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">During the Meeting</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Start with a clear agenda overview</li>
                <li>• Keep discussions focused and on-time</li>
                <li>• Encourage participation from all attendees</li>
                <li>• Document action items and next steps</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Export/Save Options */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Save Your Preparation</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const agendaData = {
                  title: meetingData.title,
                  type: meetingTemplate.title,
                  duration: meetingData.duration,
                  participants: meetingData.participants,
                  objectives: meetingData.objectives,
                  agenda: meetingData.customAgenda.length > 0 ? meetingData.customAgenda : meetingTemplate.agenda,
                  notes: meetingData.notes,
                  practiceNotes: practiceNotes
                };
                
                const dataStr = JSON.stringify(agendaData, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${meetingData.title || 'meeting'}-agenda.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Agenda
            </button>
            
            {recordings.length > 0 && (
              <button
                onClick={() => {
                  recordings.forEach((recording, index) => {
                    const link = document.createElement('a');
                    link.href = recording.url;
                    link.download = `meeting-practice-${index + 1}.wav`;
                    link.click();
                  });
                }}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Recordings
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <button
            onClick={() => {
              setPracticeNotes('');
              setRecordings([]);
              setCurrentRecording(null);
              setStep('practice');
            }}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Practice More
          </button>
          <button
            onClick={() => {
              setMeetingData({
                title: '',
                type: 'standup',
                participants: '',
                duration: 15,
                objectives: '',
                customAgenda: [],
                notes: ''
              });
              setPracticeNotes('');
              setRecordings([]);
              setCurrentRecording(null);
              setStep('setup');
            }}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            New Meeting Prep
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
        {step === 'setup' && <MeetingSetup />}
        {step === 'agenda' && <AgendaPlanning />}
        {step === 'practice' && <PracticeSession />}
        {step === 'feedback' && <MeetingFeedback />}
      </main>
    </div>
  );
};

export default MeetingPrep;