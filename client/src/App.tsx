import React, { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { LandingPage } from './pages/LandingPage'
import { VisionWizardPage } from './pages/VisionWizardPage'
import { GoalsSetupPage } from './pages/GoalsSetupPage'
import { RegistrationPromptPage } from './pages/RegistrationPromptPage'
import { CreateGoalPage } from './pages/CreateGoalPage'
import { SetupGoalPage } from './pages/SetupGoalPage'
import { DashboardPage } from './pages/DashboardPage'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/vision" element={<VisionWizardPage />} />
      <Route path="/goals-setup" element={<GoalsSetupPage />} />
      <Route path="/setup-goal" element={<SetupGoalPage />} />
      <Route path="/register-prompt" element={<RegistrationPromptPage />} />
      <Route path="/create-goal" element={<CreateGoalPage />} />
      <Route path="/dashboard" element={<DashboardPage setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}



