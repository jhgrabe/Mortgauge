import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // 'checking' until the request finishes, then 'ok' or 'unreachable'
  const [apiStatus, setApiStatus] = useState('checking')

  // Form fields stay as strings; the backend parses and validates them.
  const [form, setForm] = useState({ principal: '', annualRate: '', years: '' })
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/health/')
      .then((response) => response.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('unreachable'))
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setResult(null)
    setError(null)

    const response = await fetch('/api/payment/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        principal: form.principal,
        annual_rate: form.annualRate,
        years: form.years,
      }),
    })
    const data = await response.json()

    if (response.ok) {
      setResult(data.monthly_payment)
    } else {
      // DRF returns either {detail: "..."} or {field: ["msg", ...]}
      setError(typeof data.detail === 'string' ? data.detail : JSON.stringify(data))
    }
  }

  return (
    <main>
      <h1>Mortgauge</h1>
      <p>Figure out what home you can actually afford.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Loan amount ($)
          <input
            name="principal"
            type="number"
            step="0.01"
            value={form.principal}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Interest rate (% per year)
          <input
            name="annualRate"
            type="number"
            step="0.001"
            value={form.annualRate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Term (years)
          <input
            name="years"
            type="number"
            value={form.years}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Calculate payment</button>
      </form>

      {result && <p className="result">Monthly payment (P&amp;I): ${result}</p>}
      {error && <p className="error">{error}</p>}

      <p className={`api-status ${apiStatus}`}>
        API: {apiStatus}
      </p>
    </main>
  )
}

export default App
