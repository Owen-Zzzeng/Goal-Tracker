import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function CreateGoalPage() {
  const [title, setTitle] = useState('')
  const [why, setWhy] = useState('')
  const [completionDate, setCompletionDate] = useState('')
  const [strategies, setStrategies] = useState([{ title: '', status: 'UNBEGUN' as const, actions: [{ description: '', status: 'UNBEGUN' as const }] }])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const navigate = useNavigate()

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

    if (!title.trim()) {
      setError('Goal title is required')
      return
    }

    if (!completionDate) {
      setError('Completion date is required')
      return
    }

    try {
      // For now, just store in localStorage
      const goalData = {
        id: Date.now().toString(),
        title,
        why,
        expectedCompletionDate: completionDate,
        strategies: strategies.filter(s => s.title.trim()),
        status: 'UNBEGUN',
        createdAt: new Date().toISOString()
      }

      const existingGoals = JSON.parse(localStorage.getItem('userGoals') || '[]')
      existingGoals.push(goalData)
      localStorage.setItem('userGoals', JSON.stringify(existingGoals))

      // Check if we have 5 goals or if user wants to continue
      if (existingGoals.length >= 5) {
        navigate('/register-prompt')
      } else {
        // Reset form for next goal
        setTitle('')
        setWhy('')
        setCompletionDate('')
        setStrategies([{ title: '', status: 'UNBEGUN' as const, actions: [{ description: '', status: 'UNBEGUN' as const }] }])
        setError(null)
        setSuccess(`Goal "${title}" added successfully! You can add ${4 - existingGoals.length} more goals.`)
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create goal')
    }
  }

  const handleComplete = () => {
    navigate('/register-prompt')
  }

  const existingGoals = JSON.parse(localStorage.getItem('userGoals') || '[]')
  const canAddMore = existingGoals.length < 5

  return (
    <div className="create-goal-container">
      <div className="create-goal-content">
        <h1>Create Your Goal</h1>
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

          <div className="goal-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(existingGoals.length / 5) * 100}%` }}
              ></div>
            </div>
            <p className="progress-text">
              Goal {existingGoals.length + 1} of 5
            </p>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Cancel
            </button>
            {existingGoals.length > 0 && (
              <button type="button" onClick={handleComplete} className="btn btn-success">
                Complete Setup
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {canAddMore ? 'Add Goal & Continue' : 'Add Final Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
