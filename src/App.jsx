import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import Interviewee from './pages/Interviewee'
import Presenter from './pages/Presenter'
import Interviewer from './pages/Interviewer'
import MeetingPrep from './pages/MeetingPrep'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interviewee" element={<Interviewee />} />
        <Route path="/presenter" element={<Presenter />} />
        <Route path="/interviewer" element={<Interviewer />} />
        <Route path="/meeting-prep" element={<MeetingPrep />} />
      </Routes>
    </Router>
  )
}

export default App
