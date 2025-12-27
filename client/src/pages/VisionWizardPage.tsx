import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const prompts = [
  { key: 'learn', label: 'What do you want to learn?' },
  { key: 'have', label: 'What do you want to have?' },
  { key: 'be', label: 'Who do you want to be?' },
  { key: 'try', label: 'What do you want to try?' },
  { key: 'see', label: 'What do you want to see?' },
  { key: 'do', label: 'What do you want to do?' },
  { key: 'go', label: 'Where do you want to go?' },
  { key: 'create', label: 'What do you want to create?' },
  { key: 'contribute', label: 'What do you want to contribute to?' },
  { key: 'overcome', label: 'What do you want to overcome?' },
  { key: 'oneDay', label: 'What do you want to achieve in one day?' },
] as const

type FormState = Partial<Record<(typeof prompts)[number]['key'], string>>

export function VisionWizardPage() {
  const [idx, setIdx] = useState(0)
  const [form, setForm] = useState<FormState>({})
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const current = prompts[idx]

  async function submitAll() {
    try {
      localStorage.setItem('userVision', JSON.stringify(form))
      navigate('/goals-setup')
    } catch (err: any) {
      setError(err?.message || 'Failed to save vision')
    }
  }

  function next() {
    if (idx < prompts.length - 1) {
      setIdx(idx + 1)
    } else {
      submitAll()
    }
  }

  function prev() {
    if (idx > 0) {
      setIdx(idx - 1)
    }
  }

  return (
    <div className="vision-container">
      <h1>Your Five-Year Vision</h1>
      
      <div className="vision-progress">
        {prompts.map((_, i) => (
          <div
            key={i}
            className={`progress-step ${i === idx ? 'active' : i < idx ? 'completed' : ''}`}
          >
            {i < idx ? '✓' : i + 1}
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>{current.label}</label>
        <textarea
          value={form[current.key] || ''}
          onChange={(e) => setForm((f) => ({ ...f, [current.key]: e.target.value }))}
          placeholder="Take your time to reflect on this question..."
          rows={6}
        />
      </div>

      {error && <div className="message error">{error}</div>}
      
      <div className="vision-navigation">
        <button 
          onClick={prev} 
          disabled={idx === 0}
          className="btn btn-secondary"
        >
          ← Back
        </button>
        <button 
          onClick={next}
          className="btn btn-primary"
        >
          {idx === prompts.length - 1 ? 'Complete Vision →' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
