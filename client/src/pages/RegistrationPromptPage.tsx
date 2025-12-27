import { Link } from 'react-router-dom'

export function RegistrationPromptPage() {
  return (
    <div className="registration-prompt-container">
      <div className="prompt-content">
        <div className="prompt-icon">💾</div>
        <h1>Save Your Progress?</h1>
        <p className="prompt-subtitle">
          You've created an amazing vision and goals! Would you like to save your progress so you can access it anytime?
        </p>
        
        <div className="benefits">
          <h3>With an account, you can:</h3>
          <ul>
            <li>✅ Access your goals from any device</li>
            <li>✅ Track your progress over time</li>
            <li>✅ Add milestones and celebrate achievements</li>
            <li>✅ Write letters to your future self</li>
            <li>✅ Get quarterly summaries and reflections</li>
          </ul>
        </div>
        
        <div className="prompt-actions">
          <Link to="/register" className="btn btn-primary btn-large">
            Yes, Create Account
          </Link>
          <Link to="/dashboard" className="btn btn-secondary btn-large">
            Continue Without Saving
          </Link>
        </div>
        
        <p className="prompt-note">
          Already have an account? <Link to="/login" style={{ color: '#667eea', textDecoration: 'none' }}>Sign in here</Link>
        </p>
      </div>
    </div>
  )
}
