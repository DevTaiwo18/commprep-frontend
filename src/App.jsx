import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
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
import Forgetpassword from './pages/Forgetpassword'

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<Forgetpassword />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/interviewee" 
          element={<ProtectedRoute><Interviewee /></ProtectedRoute>} 
        />
        <Route 
          path="/presenter" 
          element={<ProtectedRoute><Presenter /></ProtectedRoute>} 
        />
        <Route 
          path="/interviewer" 
          element={<ProtectedRoute><Interviewer /></ProtectedRoute>} 
        />
        <Route 
          path="/meeting-prep" 
          element={<ProtectedRoute><MeetingPrep /></ProtectedRoute>} 
        />
        <Route 
          path="/settings" 
          element={<ProtectedRoute><Settings /></ProtectedRoute>} 
        />
        <Route 
          path="/sessions" 
          element={<ProtectedRoute><Sessions /></ProtectedRoute>} 
        />

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
