import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api from '../lib/api'

type Status = 'UNBEGUN' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETE'

type Action = {
  id?: string
  description: string
  status: Status
}

type Strategy = {
  id?: string
  title: string
  status: Status
  actions: Action[]
}

type Goal = {
  id: string
  title: string
  why?: string
  status: Status
  expectedCompletionDate: string
  strategies: Strategy[]
  milestones?: (string | { text: string; timestamp: string; date: string; time: string })[]
}

export function DashboardPage({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [vision, setVision] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [milestoneTexts, setMilestoneTexts] = useState<Record<string, string>>({})
  const [showCongratulations, setShowCongratulations] = useState(false)
  const [completedGoal, setCompletedGoal] = useState<string>('')
  const location = useLocation()

  const updateGoalStatus = (goalId: string, newStatus: Status) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, status: newStatus } : goal
    )
    setGoals(updatedGoals)

    // Check if goal was completed
    const completedGoalItem = updatedGoals.find(g => g.id === goalId && newStatus === 'COMPLETE')
    if (completedGoalItem) {
      // Trigger fireworks animation
      triggerFireworks()
      // Show congratulations message
      setCompletedGoal(completedGoalItem.title)
      setTimeout(() => {
        setShowCongratulations(true)
      }, 1000)
    }

    const token = localStorage.getItem('token')
    if (token) {
      // Update in database
      api.patch(`/goals/${goalId}/status`, { status: newStatus })
        .catch(err => console.error('Failed to update goal status in database:', err))
    } else {
      // Update in localStorage
      localStorage.setItem('userGoals', JSON.stringify(updatedGoals))
    }
  }

  const triggerFireworks = () => {
    // Create fireworks container
    const fireworksContainer = document.createElement('div')
    fireworksContainer.className = 'fireworks-container'
    document.body.appendChild(fireworksContainer)

    // Create multiple fireworks
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createFirework(fireworksContainer)
      }, i * 200)
    }

    // Remove container after animation
    setTimeout(() => {
      document.body.removeChild(fireworksContainer)
    }, 3000)
  }

  const createFirework = (container: HTMLElement) => {
    const firework = document.createElement('div')
    firework.className = 'firework'

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
    const color = colors[Math.floor(Math.random() * colors.length)]

    firework.style.left = Math.random() * window.innerWidth + 'px'
    firework.style.top = Math.random() * window.innerHeight + 'px'
    firework.style.backgroundColor = color

    container.appendChild(firework)

    // Remove firework after animation
    setTimeout(() => {
      if (firework.parentNode) {
        firework.parentNode.removeChild(firework)
      }
    }, 1000)
  }

  const updateStrategyStatus = (goalId: string, strategyIndex: number, newStatus: Status) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedStrategies = [...goal.strategies]
        updatedStrategies[strategyIndex] = { ...updatedStrategies[strategyIndex], status: newStatus }
        return { ...goal, strategies: updatedStrategies }
      }
      return goal
    })
    setGoals(updatedGoals)

    const token = localStorage.getItem('token')
    if (token) {
      // Update in database
      const strategyId = updatedGoals.find(g => g.id === goalId)?.strategies[strategyIndex]?.id
      if (strategyId) {
        api.patch(`/goals/strategies/${strategyId}/status`, { status: newStatus })
          .catch(err => console.error('Failed to update strategy status in database:', err))
      }
    } else {
      // Update in localStorage
      localStorage.setItem('userGoals', JSON.stringify(updatedGoals))
    }
  }

  const updateActionStatus = (goalId: string, strategyIndex: number, actionIndex: number, newStatus: Status) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedStrategies = [...goal.strategies]
        const updatedActions = [...updatedStrategies[strategyIndex].actions]
        updatedActions[actionIndex] = { ...updatedActions[actionIndex], status: newStatus }
        updatedStrategies[strategyIndex] = { ...updatedStrategies[strategyIndex], actions: updatedActions }
        return { ...goal, strategies: updatedStrategies }
      }
      return goal
    })
    setGoals(updatedGoals)

    const token = localStorage.getItem('token')
    if (token) {
      // Update in database
      const actionId = updatedGoals.find(g => g.id === goalId)?.strategies[strategyIndex]?.actions[actionIndex]?.id
      if (actionId) {
        api.patch(`/goals/actions/${actionId}/status`, { status: newStatus })
          .catch(err => console.error('Failed to update action status in database:', err))
      }
    } else {
      // Update in localStorage
      localStorage.setItem('userGoals', JSON.stringify(updatedGoals))
    }
  }

  const addMilestone = (goalId: string) => {
    const milestoneText = milestoneTexts[goalId]
    if (!milestoneText || !milestoneText.trim()) return

    const newMilestone = {
      text: milestoneText.trim(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const milestones = goal.milestones || []
        return { ...goal, milestones: [...milestones, newMilestone] }
      }
      return goal
    })
    setGoals(updatedGoals)

    const token = localStorage.getItem('token')
    if (token) {
      // Update in database
      api.patch(`/goals/${goalId}/milestones`, { milestones: updatedGoals.find(g => g.id === goalId)?.milestones })
        .catch(err => console.error('Failed to update milestones in database:', err))
    } else {
      // Update in localStorage
      localStorage.setItem('userGoals', JSON.stringify(updatedGoals))
    }

    // Clear the specific milestone text for this goal
    setMilestoneTexts(prev => ({ ...prev, [goalId]: '' }))
  }

  const loadData = () => {
    const token = localStorage.getItem('token')
    console.log('loadData called, token exists:', !!token)
    setLoading(true)

    if (token) {
      // User is authenticated, load from database
      console.log('Loading goals from database with token:', token)

      let visionLoaded = false
      let goalsLoaded = false

      const checkAndSetLoading = () => {
        if (visionLoaded && goalsLoaded) {
          console.log('Both vision and goals loaded, setting loading to false')
          setLoading(false)
        }
      }

      // Load vision data
      api.get('/vision/latest')
        .then((res) => {
          console.log('Vision from database:', res.data)
          setVision(res.data)
        })
        .catch((err) => {
          console.error('Error loading vision from database:', err)
          // Fallback to localStorage if database fails
          const savedVision = localStorage.getItem('userVision')
          if (savedVision) {
            try {
              const parsedVision = JSON.parse(savedVision)
              console.log('Using vision from localStorage:', parsedVision)
              setVision(parsedVision)
            } catch (error) {
              console.error('Error parsing vision from localStorage:', error)
              setVision(null)
            }
          } else {
            setVision(null)
          }
        })
        .finally(() => {
          visionLoaded = true
          checkAndSetLoading()
        })

      // Load goals data
      api.get('/goals')
        .then((res) => {
          console.log('Goals from database:', res.data)
          setGoals(res.data || [])
        })
        .catch((err) => {
          console.error('Error loading goals from database:', err)
          console.error('Error details:', err.response?.data)
          // Fallback to localStorage if database fails
          const savedGoals = localStorage.getItem('userGoals')
          if (savedGoals) {
            try {
              const parsedGoals = JSON.parse(savedGoals)
              console.log('Using goals from localStorage:', parsedGoals)
              setGoals(parsedGoals || [])
            } catch (error) {
              console.error('Error parsing goals from localStorage:', error)
              setGoals([])
            }
          } else {
            setGoals([])
          }
        })
        .finally(() => {
          goalsLoaded = true
          checkAndSetLoading()
        })
    } else {
      // User not authenticated, load from localStorage
      console.log('User not authenticated, loading from localStorage')
      const savedVision = localStorage.getItem('userVision')
      console.log('savedVision exists:', !!savedVision)
      if (savedVision) {
        try {
          const parsedVision = JSON.parse(savedVision)
          console.log('Using vision from localStorage:', parsedVision)
          setVision(parsedVision)
        } catch (error) {
          console.error('Error parsing vision from localStorage:', error)
          setVision(null)
        }
      } else {
        console.log('No vision in localStorage')
        setVision(null)
      }

      const savedGoals = localStorage.getItem('userGoals')
      console.log('Loading goals from localStorage, exists:', !!savedGoals, 'content:', savedGoals)
      if (savedGoals) {
        try {
          const parsedGoals = JSON.parse(savedGoals)
          console.log('Parsed goals:', parsedGoals, 'count:', parsedGoals.length)
          setGoals(parsedGoals)
        } catch (error) {
          console.error('Error parsing goals:', error)
          setGoals([])
        }
      } else {
        console.log('No goals in localStorage')
        setGoals([])
      }
      console.log('Setting loading to false')
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load data when component mounts or when navigating to dashboard
    console.log('useEffect triggered, pathname:', location.pathname)
    if (location.pathname === '/dashboard') {
      console.log('Loading data for dashboard')
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const activeGoals = goals.filter(g => g.status !== 'COMPLETE')
  const isAuthenticated = !!localStorage.getItem('token')

  console.log('DashboardPage render:', { loading, goalsCount: goals.length, visionExists: !!vision, isAuthenticated })

  return (
    <div className="dashboard-container">
      <div className="nav">
        <h1>Goal Tracker</h1>
        <div className="nav-links">
          <Link to="/create-goal">Add Goal</Link>
          {isAuthenticated ? (
            <button
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('userVision')
                localStorage.removeItem('userGoals')
                setIsAuthenticated(false)
                window.location.href = '/'
              }}
              className="btn-link"
            >
              Logout
            </button>
          ) : (
            <Link to="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 500, padding: '8px 16px', borderRadius: '6px', transition: 'all 0.2s ease' }}>
              Sign Up
            </Link>
          )}
        </div>
      </div>

      {/* Vision Summary */}
      {vision && (
        <div className="vision-summary">
          <h2>Your Five-Year Vision</h2>
          <div className="vision-grid">
            {Object.entries(vision).map(([key, value]) => {
              if (key === 'id' || key === 'userId' || key === 'createdAt' || key === 'updatedAt') return null
              if (!value) return null
              return (
                <div key={key} className="vision-item">
                  <h4>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</h4>
                  <p>{value as string}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <h3>Loading...</h3>
        </div>
      ) : null}

      {!loading && goals.length === 0 ? (
        <div className="empty-state">
          <h3>No goals yet</h3>
          <p>Start by creating your first goal to begin your journey.</p>
          <Link to="/create-goal" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Add Your First Goal
          </Link>
        </div>
      ) : null}

      {!loading && goals.length > 0 && (
        goals.map((g) => (
          <div key={g.id} className="goal-card">
            <div className="goal-header">
              <h2 className="goal-title">{g.title}</h2>
              <div className="goal-controls">
                <div className={`status-badge status-${(g.status || 'UNBEGUN').toLowerCase()}`}>
                  {g.status === 'COMPLETE' && <span className="status-icon status-icon-complete">✓</span>}
                  <select
                    value={g.status}
                    onChange={(e) => updateGoalStatus(g.id, e.target.value as Status)}
                    className="status-select"
                  >
                    <option value="UNBEGUN">Unbegun</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="PAUSED">Paused</option>
                    <option value="COMPLETE">Complete</option>
                  </select>
                </div>
              </div>
            </div>

            {g.why && (
              <p className="goal-why"><strong>Why:</strong> {g.why}</p>
            )}

            <p className="goal-date">
              <strong>Target Date:</strong> {new Date(g.expectedCompletionDate).toLocaleDateString()}
            </p>

            {g.strategies && g.strategies.length > 0 && g.strategies.map((s, strategyIndex) => (
              <div key={strategyIndex} className="strategy-item">
                <div className="strategy-header">
                  <h3>Strategy {strategyIndex + 1}: {s.title}</h3>
                  <div className={`status-badge status-${(s.status || 'UNBEGUN').toLowerCase()} small`}>
                    {s.status === 'COMPLETE' && <span className="status-icon status-icon-complete">✓</span>}
                    <select
                      value={s.status}
                      onChange={(e) => updateStrategyStatus(g.id, strategyIndex, e.target.value as Status)}
                      className="status-select"
                    >
                      <option value="UNBEGUN">Unbegun</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="PAUSED">Paused</option>
                      <option value="COMPLETE">Complete</option>
                    </select>
                  </div>
                </div>
                {s.actions && s.actions.length > 0 && (
                  <div className="action-list">
                    {s.actions.map((a, actionIndex) => (
                      <div key={actionIndex} className="action-item">
                        <span className="action-text">Step {actionIndex + 1}: {a.description}</span>
                        <div className={`status-badge status-${(a.status || 'UNBEGUN').toLowerCase()} small`}>
                          {a.status === 'COMPLETE' && <span className="status-icon status-icon-complete">✓</span>}
                          <select
                            value={a.status}
                            onChange={(e) => updateActionStatus(g.id, strategyIndex, actionIndex, e.target.value as Status)}
                            className="status-select"
                          >
                            <option value="UNBEGUN">Unbegun</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="PAUSED">Paused</option>
                            <option value="COMPLETE">Complete</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="milestones-section">
              <h4>Milestones</h4>
              {g.milestones && g.milestones.length > 0 ? (
                <div className="milestones-list">
                  {g.milestones.map((milestone, index) => (
                    <div key={index} className="milestone-item">
                      <span className="milestone-icon">🎉</span>
                      <div className="milestone-content">
                        <span className="milestone-text">
                          {typeof milestone === 'string' ? milestone : milestone.text}
                        </span>
                        {typeof milestone === 'object' && milestone.timestamp && (
                          <span className="milestone-time">
                            {milestone.date} at {milestone.time}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-milestones">No milestones yet</p>
              )}
              <div className="add-milestone">
                <input
                  type="text"
                  value={milestoneTexts[g.id] || ''}
                  onChange={(e) => setMilestoneTexts(prev => ({ ...prev, [g.id]: e.target.value }))}
                  placeholder="Add a milestone..."
                  onKeyPress={(e) => e.key === 'Enter' && addMilestone(g.id)}
                />
                <button
                  onClick={() => addMilestone(g.id)}
                  className="btn btn-success btn-small"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Congratulations Modal */}
      {showCongratulations && (
        <div className="congratulations-modal">
          <div className="congratulations-content">
            <div className="congratulations-icon">🎉</div>
            <h2>Congratulations!</h2>
            <p>You've completed: <strong>"{completedGoal}"</strong></p>
            <p>You're amazing! Keep up the great work!</p>
            <button
              onClick={() => setShowCongratulations(false)}
              className="btn btn-primary"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}



