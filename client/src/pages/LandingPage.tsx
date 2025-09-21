import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-header">
        <div className="logo">
          <h2>Goal Tracker</h2>
        </div>
        <Link to="/login" className="btn btn-secondary">
          Login
        </Link>
      </div>
      
      <div className="landing-content">
        <h1>Transform Your Dreams Into Reality</h1>
        <p className="landing-subtitle">
          Discover your five-year vision and create actionable goals to achieve your biggest dreams
        </p>
        
        <div className="features">
          <div className="feature">
            <div className="feature-icon">🎯</div>
            <h3>Define Your Vision</h3>
            <p>Answer 11 powerful questions to clarify your five-year fantasy</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📋</div>
            <h3>Set Smart Goals</h3>
            <p>Break down your vision into achievable one-year goals</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🚀</div>
            <h3>Track Progress</h3>
            <p>Monitor your journey with strategies and action steps</p>
          </div>
        </div>
        
        <div className="cta-section">
          <Link to="/vision" className="btn btn-primary btn-large">
            Start Your Five-Year Fantasy
          </Link>
          <p className="cta-note">No registration required to get started</p>
        </div>
      </div>
    </div>
  )
}


