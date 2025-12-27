import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

type Status = 'UNBEGUN' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETE'

type Goal = {
  id: string
  title: string
  why?: string
  status: Status
  expectedCompletionDate: string
  strategies?: any[]
}

export function CreateGoalPage() {
  const [title, setTitle] = useState('')
  const [why, setWhy] = useState('')
  const [completionDate, setCompletionDate] = useState('')
  const [strategies, setStrategies] = useState([{ title: '', status: 'UNBEGUN' as const, actions: [{ description: '', status: 'UNBEGUN' as const }] }])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeGoalsCount, setActiveGoalsCount] = useState(0)
  const [loadingGoals, setLoadingGoals] = useState(true)
  const navigate = useNavigate()

  const isAuthenticated = !!localStorage.getItem('token')

  // Load active goals count
  useEffect(() => {
    const loadActiveGoalsCount = async () => {
      console.log('CreateGoalPage: Loading active goals count, isAuthenticated:', isAuthenticated)
      try {
        if (isAuthenticated) {
          const response = await api.get('/goals')
          const goals: Goal[] = response.data
          const active = goals.filter(g => g.status !== 'COMPLETE')
          console.log('CreateGoalPage: Authenticated - total goals:', goals.length, 'active:', active.length)
          setActiveGoalsCount(active.length)
        } else {
          const existingGoals: Goal[] = JSON.parse(localStorage.getItem('userGoals') || '[]')
          const active = existingGoals.filter(g => g.status !== 'COMPLETE')
          console.log('CreateGoalPage: Not authenticated - total goals:', existingGoals.length, 'active:', active.length, 'goals:', existingGoals)
          setActiveGoalsCount(active.length)
        }
      } catch (err) {
        console.error('Error loading goals:', err)
        // Fallback to localStorage
        const existingGoals: Goal[] = JSON.parse(localStorage.getItem('userGoals') || '[]')
        const active = existingGoals.filter(g => g.status !== 'COMPLETE')
        console.log('CreateGoalPage: Fallback - active goals:', active.length)
        setActiveGoalsCount(active.length)
      } finally {
        console.log('CreateGoalPage: Setting loadingGoals to false')
        setLoadingGoals(false)
      }
    }
    loadActiveGoalsCount()
  }, [isAuthenticated])

  const addStrategy = () => {
    if (strategies.length < 10) {
      setStrategies([...strategies, { title: '', status: 'UNBEGUN' as const, actions: [{ description: '', status: 'UNBEGUN' as const }] }])
    }
  }

  const addAction = (strategyIndex: number) => {
    if (strategies[strategyIndex].actions.length < 10) {
      const newStrategies = [...strategies]
      newStrategies[strategyIndex].actions.push({ description: '', status: 'UNBEGUN' as const })
      setStrategies(newStrategies)
    }
  }

  const updateStrategy = (index: number, field: string, value: string) => {
    const newStrategies = [...strategies]
    newStrategies[index] = { ...newStrategies[index], [field]: value }
    setStrategies(newStrategies)
  }

  const updateAction = (strategyIndex: number, actionIndex: number, value: string) => {
    const newStrategies = [...strategies]
    newStrategies[strategyIndex].actions[actionIndex].description = value
    setStrategies(newStrategies)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    // Check active goals limit
    if (activeGoalsCount >= 5) {
      setError('You already have 5 active goals. Please complete at least one goal before adding a new one.')
      setLoading(false)
      return
    }

    if (!title.trim()) {
      setError('Goal title is required')
      setLoading(false)
      return
    }

    if (!completionDate) {
      setError('Completion date is required')
      setLoading(false)
      return
    }

    try {
      const goalData = {
        title,
        why: why || undefined,
        expectedCompletionDate: new Date(completionDate).toISOString(),
        strategies: strategies
          .filter(s => s.title.trim())
          .map(s => ({
            title: s.title,
            actions: s.actions.filter(a => a.description.trim()).map(a => ({ description: a.description }))
          }))
      }

      if (isAuthenticated) {
        // Save to database
        await api.post('/goals', goalData)
        setSuccess('Goal created successfully!')
      } else {
        // Save to localStorage
        const existingGoals = JSON.parse(localStorage.getItem('userGoals') || '[]')
        const newGoal = {
          ...goalData,
          id: Date.now().toString(),
          status: 'UNBEGUN',
          createdAt: new Date().toISOString()
        }
        const updatedGoals = [...existingGoals, newGoal]
        localStorage.setItem('userGoals', JSON.stringify(updatedGoals))
        setSuccess('Goal saved! Sign up to sync across devices.')
      }

      // Navigate to dashboard immediately to refresh data
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      console.error('Error creating goal:', err)
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to create goal'
      setError(errorMessage)
      setLoading(false)
    }
  }

  console.log('CreateGoalPage render:', { loadingGoals, activeGoalsCount, isAuthenticated })

  if (loadingGoals) {
    return (
      <div className="create-goal-container">
        <div className="create-goal-content">
          <h1>Add a New Goal</h1>
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  if (activeGoalsCount >= 5) {
    console.log('CreateGoalPage: Blocked - activeGoalsCount >= 5:', activeGoalsCount)
    return (
      <div className="create-goal-container">
        <div className="create-goal-content">
          <h1>Maximum Active Goals Reached</h1>
          <div className="message error" style={{ marginTop: '2rem' }}>
            You already have 5 active goals. Please complete at least one goal before trying to add a new one.
          </div>
          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="create-goal-container">
      <div className="create-goal-content">
        <h1>Add a New Goal</h1>
        <p className="create-subtitle">
          Break down your vision into actionable goals for this year
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Goal Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to achieve?"
              required
            />
          </div>

          <div className="form-group">
            <label>Why is this important to you?</label>
            <textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Your motivation and reason for this goal..."
            />
          </div>

          <div className="form-group">
            <label>Expected Completion Date *</label>
            <input
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              required
            />
          </div>

          <div className="strategies-section">
            <h3>Strategies (1-10)</h3>
            <p className="section-note">Break down your goal into strategies and action steps</p>

            {strategies.map((strategy, strategyIndex) => (
              <div key={strategyIndex} className="strategy-form">
                <div className="form-group">
                  <label>Strategy {strategyIndex + 1}</label>
                  <input
                    value={strategy.title}
                    onChange={(e) => updateStrategy(strategyIndex, 'title', e.target.value)}
                    placeholder="What strategy will you use?"
                  />
                </div>

                <div className="actions-section">
                  <label>Action Steps (1-10)</label>
                  {strategy.actions.map((action, actionIndex) => (
                    <div key={actionIndex} className="action-input">
                      <input
                        value={action.description}
                        onChange={(e) => updateAction(strategyIndex, actionIndex, e.target.value)}
                        placeholder={`Action step ${actionIndex + 1}`}
                      />
                    </div>
                  ))}
                  {strategy.actions.length < 10 && (
                    <button
                      type="button"
                      onClick={() => addAction(strategyIndex)}
                      className="btn btn-secondary btn-small"
                    >
                      + Add Action Step
                    </button>
                  )}
                </div>
              </div>
            ))}

            {strategies.length < 10 && (
              <button
                type="button"
                onClick={addStrategy}
                className="btn btn-secondary"
              >
                + Add Strategy
              </button>
            )}
          </div>

          {error && <div className="message error">{error}</div>}
          {success && <div className="message success">{success}</div>}

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Add the Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

