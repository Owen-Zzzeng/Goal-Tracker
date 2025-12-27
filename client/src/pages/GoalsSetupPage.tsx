import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function GoalsSetupPage() {
  const [visionData, setVisionData] = useState<any>(null)

  useEffect(() => {
    const savedVision = localStorage.getItem('userVision')
    if (savedVision) {
      setVisionData(JSON.parse(savedVision))
    }
  }, [])

  return (
    <div className="goals-setup-container">
      <div className="goals-setup-content">
        <div className="success-checkmark">✅</div>
        <h1>Amazing! Your Vision is Complete</h1>
        <p className="setup-subtitle">
          Now let's break down your five-year fantasy into actionable goals you want to achieve this year.
        </p>

        {visionData && (
          <div className="vision-summary">
            <h3>Your Vision Summary:</h3>
            <div className="vision-highlights">
              {visionData.learn && <p><strong>Learn:</strong> {visionData.learn}</p>}
              {visionData.have && <p><strong>Have:</strong> {visionData.have}</p>}
              {visionData.be && <p><strong>Be:</strong> {visionData.be}</p>}
              {visionData.try && <p><strong>Try:</strong> {visionData.try}</p>}
              {visionData.see && <p><strong>See:</strong> {visionData.see}</p>}
              {visionData.do && <p><strong>Do:</strong> {visionData.do}</p>}
              {visionData.go && <p><strong>Go:</strong> {visionData.go}</p>}
              {visionData.create && <p><strong>Create:</strong> {visionData.create}</p>}
              {visionData.contribute && <p><strong>Contribute:</strong> {visionData.contribute}</p>}
              {visionData.overcome && <p><strong>Overcome:</strong> {visionData.overcome}</p>}
              {visionData.oneDay && <p><strong>One Day:</strong> {visionData.oneDay}</p>}
            </div>
          </div>
        )}

        <div className="setup-info">
          <h3>What's Next?</h3>
          <ul>
            <li>Create 1-5 specific goals for this year</li>
            <li>Add your "Why" for each goal</li>
            <li>Break down each goal into strategies and action steps</li>
            <li>Set completion dates and track your progress</li>
          </ul>
        </div>

        <div className="setup-cta">
          <Link to="/setup-goal" className="btn btn-primary btn-large">
            Add Your First Goal
          </Link>
          <p className="setup-note">
            You can add up to 5 goals to break down your vision
          </p>
        </div>
      </div>
    </div>
  )
}
