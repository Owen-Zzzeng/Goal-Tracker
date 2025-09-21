import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../lib/api'

export function RegisterPage({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      // Register the user
      const registerResponse = await api.post('/auth/register', { email, password, name })
      
      // Get stored data from localStorage
      const visionData = localStorage.getItem('userVision')
      const goalsData = localStorage.getItem('userGoals')
      
      if (registerResponse.data.token) {
        // Store the token
        localStorage.setItem('token', registerResponse.data.token)
        
        // Save vision data to database
        if (visionData) {
          try {
            await api.post('/vision', JSON.parse(visionData))
          } catch (err) {
            console.error('Failed to save vision:', err)
          }
        }
        
              // Save goals data to database
      if (goalsData) {
        try {
          const goals = JSON.parse(goalsData)
          console.log('Saving goals to database:', goals)
          for (const goal of goals) {
            const response = await api.post('/goals', goal)
            console.log('Goal saved:', response.data)
          }
        } catch (err) {
          console.error('Failed to save goals:', err)
          console.error('Error details:', err.response?.data)
        }
      }
        
        // Clear localStorage data since it's now in the database
        localStorage.removeItem('userVision')
        localStorage.removeItem('userGoals')
        
        setIsAuthenticated(true)
        setSuccess('Account created and data saved! Redirecting to dashboard...')
        setTimeout(() => navigate('/dashboard'), 1000)
      } else {
        setSuccess('Account created. You can login now.')
        setTimeout(() => navigate('/login'), 500)
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="auth-container">
      <h1>Create Account</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="your@email.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="At least 8 characters" />
        </div>
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Create Account
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Have an account? <Link to="/login" style={{ color: '#667eea', textDecoration: 'none' }}>Sign in</Link>
      </p>
    </div>
  )
}



