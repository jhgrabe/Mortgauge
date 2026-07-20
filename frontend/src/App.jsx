import { useEffect, useState } from 'react'
import './App.css'

// DRF sends errors as either {detail: "..."} (one message) or
// {field_name: ["message", ...]} (per-field). Flatten either shape into
// a list of readable "field: message" strings for display.
function parseErrors(data) {
  if (typeof data.detail === 'string') return [data.detail]
  return Object.entries(data).flatMap(([field, messages]) =>
    messages.map((message) => `${field.replaceAll('_', ' ')}: ${message}`)
  )
}

function ErrorList({ errors }) {
  if (!errors) return null
  return (
    <ul className="error">
      {errors.map((message) => <li key={message}>{message}</li>)}
    </ul>
  )
}

function App() {
  // 'checking' until the request finishes, then 'ok' or 'unreachable'
  const [apiStatus, setApiStatus] = useState('checking')

  // Form fields stay as strings; the backend parses and validates them.
  // 30-year terms are the common case, so it's pre-filled instead of blank.
  const [form, setForm] = useState({
    principal: '', annualRate: '', years: '30',
    annualTaxes: '', annualInsurance: '', monthlyHoa: '',
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Affordability form has its own state — separate calculation, separate result.
  const [affordForm, setAffordForm] = useState({
    annualIncome: '', monthlyDebts: '', downPayment: '',
    annualRate: '', years: '30',
    annualTaxes: '', annualInsurance: '', monthlyHoa: '',
  })
  const [affordResult, setAffordResult] = useState(null)
  const [affordError, setAffordError] = useState(null)
  const [affordSubmitting, setAffordSubmitting] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  // Saved scenarios: the list, plus the name typed in before saving one.
  const [scenarios, setScenarios] = useState([])
  const [scenarioName, setScenarioName] = useState('')
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)

  function loadScenarios() {
    fetch('/api/scenarios/')
      .then((response) => response.json())
      .then((data) => setScenarios(data))
      .catch(() => {})
  }

  useEffect(() => {
    fetch('/api/health/')
      .then((response) => response.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('unreachable'))

    loadScenarios()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setResult(null)
    setError(null)
    setSubmitting(true)

    const response = await fetch('/api/payment/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        principal: form.principal,
        annual_rate: form.annualRate,
        years: form.years,
        annual_taxes: form.annualTaxes || '0',
        annual_insurance: form.annualInsurance || '0',
        monthly_hoa: form.monthlyHoa || '0',
      }),
    })
    const data = await response.json()
    setSubmitting(false)

    if (response.ok) {
      setResult(data)
    } else {
      setError(parseErrors(data))
    }
  }

  function handleAffordChange(event) {
    const { name, value } = event.target
    setAffordForm({ ...affordForm, [name]: value })
  }

  async function handleAffordSubmit(event) {
    event.preventDefault()
    setAffordResult(null)
    setAffordError(null)
    setAffordSubmitting(true)

    const response = await fetch('/api/affordability/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        annual_income: affordForm.annualIncome,
        monthly_debts: affordForm.monthlyDebts || '0',
        down_payment: affordForm.downPayment || '0',
        annual_rate: affordForm.annualRate,
        years: affordForm.years,
        annual_taxes: affordForm.annualTaxes || '0',
        annual_insurance: affordForm.annualInsurance || '0',
        monthly_hoa: affordForm.monthlyHoa || '0',
      }),
    })
    const data = await response.json()
    setAffordSubmitting(false)

    if (response.ok) {
      setAffordResult(data)
      setShowSchedule(false)
    } else {
      setAffordError(parseErrors(data))
    }
  }

  async function handleSaveScenario(event) {
    event.preventDefault()
    setSaveError(null)
    setSaving(true)

    const response = await fetch('/api/scenarios/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: scenarioName,
        annual_income: affordForm.annualIncome,
        monthly_debts: affordForm.monthlyDebts || '0',
        down_payment: affordForm.downPayment || '0',
        annual_rate: affordForm.annualRate,
        years: affordForm.years,
        annual_taxes: affordForm.annualTaxes || '0',
        annual_insurance: affordForm.annualInsurance || '0',
        monthly_hoa: affordForm.monthlyHoa || '0',
      }),
    })
    const data = await response.json()
    setSaving(false)

    if (response.ok) {
      setScenarioName('')
      loadScenarios()
    } else {
      setSaveError(parseErrors(data))
    }
  }

  function handleLoadScenario(scenario) {
    setAffordForm({
      annualIncome: scenario.annual_income,
      monthlyDebts: scenario.monthly_debts,
      downPayment: scenario.down_payment,
      annualRate: scenario.annual_rate,
      years: scenario.years,
      annualTaxes: scenario.annual_taxes,
      annualInsurance: scenario.annual_insurance,
      monthlyHoa: scenario.monthly_hoa,
    })
    setAffordResult(null)
  }

  return (
    <main>
      <span className={`api-status ${apiStatus}`}>API: {apiStatus}</span>

      <h1>Mortgauge</h1>
      <p>Figure out what home you can actually afford.</p>

      <section className="card">
      <h2>What can I afford?</h2>
      <form className="calc-form" onSubmit={handleAffordSubmit}>
        <label>
          Gross annual income ($)
          <input
            name="annualIncome"
            type="number"
            step="0.01"
            value={affordForm.annualIncome}
            onChange={handleAffordChange}
            required
          />
        </label>
        <label>
          Monthly debt payments ($, optional)
          <input
            name="monthlyDebts"
            type="number"
            step="0.01"
            value={affordForm.monthlyDebts}
            onChange={handleAffordChange}
          />
        </label>
        <label>
          Down payment ($, optional)
          <input
            name="downPayment"
            type="number"
            step="0.01"
            value={affordForm.downPayment}
            onChange={handleAffordChange}
          />
        </label>
        <label>
          Interest rate (% per year)
          <input
            name="annualRate"
            type="number"
            step="0.001"
            value={affordForm.annualRate}
            onChange={handleAffordChange}
            required
          />
        </label>
        <label>
          Term (years)
          <input
            name="years"
            type="number"
            value={affordForm.years}
            onChange={handleAffordChange}
            required
          />
        </label>
        <label>
          Annual property taxes ($, optional)
          <input
            name="annualTaxes"
            type="number"
            step="0.01"
            value={affordForm.annualTaxes}
            onChange={handleAffordChange}
          />
        </label>
        <label>
          Annual homeowners insurance ($, optional)
          <input
            name="annualInsurance"
            type="number"
            step="0.01"
            value={affordForm.annualInsurance}
            onChange={handleAffordChange}
          />
        </label>
        <label>
          Monthly HOA ($, optional)
          <input
            name="monthlyHoa"
            type="number"
            step="0.01"
            value={affordForm.monthlyHoa}
            onChange={handleAffordChange}
          />
        </label>
        <button type="submit" disabled={affordSubmitting}>
          {affordSubmitting ? 'Calculating…' : 'Calculate affordability'}
        </button>
      </form>
      <ErrorList errors={affordError} />

      {affordResult && (
        <div className="result">
          <p><strong>Max home price: ${affordResult.max_home_price}</strong></p>
          <p>Max loan amount: ${affordResult.max_loan_amount}</p>
          <p>Max monthly payment (PITI): ${affordResult.max_monthly_piti}</p>
          <p>Debt-to-income ratio: {affordResult.dti_ratio}%</p>

          {affordResult.schedule.length > 0 && (
            <>
              <button type="button" onClick={() => setShowSchedule(!showSchedule)}>
                {showSchedule ? 'Hide' : 'Show'} amortization schedule
              </button>
              {showSchedule && (
                <div className="schedule-wrapper">
                  <table className="schedule">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Payment</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {affordResult.schedule.map((row) => (
                        <tr key={row.month}>
                          <td>{row.month}</td>
                          <td>${row.payment}</td>
                          <td>${row.principal}</td>
                          <td>${row.interest}</td>
                          <td>${row.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          <form className="save-scenario" onSubmit={handleSaveScenario}>
            <label>
              Save this scenario as
              <input
                type="text"
                value={scenarioName}
                onChange={(event) => setScenarioName(event.target.value)}
                required
              />
            </label>
            <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </form>
          <ErrorList errors={saveError} />
        </div>
      )}

      {scenarios.length > 0 && (
        <div className="scenarios">
          <h3>Saved scenarios</h3>
          <ul>
            {scenarios.map((scenario) => (
              <li key={scenario.id}>
                {scenario.name}
                <button type="button" onClick={() => handleLoadScenario(scenario)}>
                  Load
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      </section>

      <section className="card">
      <h2>Monthly payment</h2>
      <form className="calc-form" onSubmit={handleSubmit}>
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
        <label>
          Annual property taxes ($, optional)
          <input
            name="annualTaxes"
            type="number"
            step="0.01"
            value={form.annualTaxes}
            onChange={handleChange}
          />
        </label>
        <label>
          Annual homeowners insurance ($, optional)
          <input
            name="annualInsurance"
            type="number"
            step="0.01"
            value={form.annualInsurance}
            onChange={handleChange}
          />
        </label>
        <label>
          Monthly HOA ($, optional)
          <input
            name="monthlyHoa"
            type="number"
            step="0.01"
            value={form.monthlyHoa}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Calculating…' : 'Calculate payment'}
        </button>
      </form>
      <ErrorList errors={error} />

      {result && (
        <div className="result">
          <p>Principal &amp; interest: ${result.principal_and_interest}</p>
          <p>Taxes (monthly): ${result.taxes}</p>
          <p>Insurance (monthly): ${result.insurance}</p>
          <p>HOA: ${result.hoa}</p>
          <p><strong>Total monthly (PITI): ${result.total}</strong></p>
        </div>
      )}
      </section>
    </main>
  )
}

export default App
