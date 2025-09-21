import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../lib/api'

export function LoginPage({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      setIsAuthenticated(true)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="auth-container">
      <h1>Welcome Back</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        {error && <div className="message error">{error}</div>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Sign In
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        No account? <Link to="/register" style={{ color: '#667eea', textDecoration: 'none' }}>Create one</Link>
      </p>
    </div>
  )
}



