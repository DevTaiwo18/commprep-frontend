import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import LandingPage from './pages/LandingPage'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import Interviewee from './pages/Interviewee'
import Presenter from './pages/Presenter'
import Interviewer from './pages/Interviewer'
import MeetingPrep from './pages/MeetingPrep'
import Settings from './pages/Settings'
import Sessions from './pages/Sessions'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Protected Routes - Will add auth protection later */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interviewee" element={<Interviewee />} />
        <Route path="/presenter" element={<Presenter />} />
        <Route path="/interviewer" element={<Interviewer />} />
        <Route path="/meeting-prep" element={<MeetingPrep />} />
        
        {/* Settings and Session Management */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/sessions" element={<Sessions />} />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App