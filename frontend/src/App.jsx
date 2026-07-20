import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // 'checking' until the request finishes, then 'ok' or 'unreachable'
  const [apiStatus, setApiStatus] = useState('checking')

  // Form fields stay as strings; the backend parses and validates them.
  const [form, setForm] = useState({
    principal: '', annualRate: '', years: '',
    annualTaxes: '', annualInsurance: '', monthlyHoa: '',
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // Affordability form has its own state — separate calculation, separate result.
  const [affordForm, setAffordForm] = useState({
    annualIncome: '', monthlyDebts: '', downPayment: '',
    annualRate: '', years: '',
    annualTaxes: '', annualInsurance: '', monthlyHoa: '',
  })
  const [affordResult, setAffordResult] = useState(null)
  const [affordError, setAffordError] = useState(null)

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
        annual_taxes: form.annualTaxes || '0',
        annual_insurance: form.annualInsurance || '0',
        monthly_hoa: form.monthlyHoa || '0',
      }),
    })
    const data = await response.json()

    if (response.ok) {
      setResult(data)
    } else {
      // DRF returns either {detail: "..."} or {field: ["msg", ...]}
      setError(typeof data.detail === 'string' ? data.detail : JSON.stringify(data))
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

    if (response.ok) {
      setAffordResult(data)
    } else {
      setAffordError(typeof data.detail === 'string' ? data.detail : JSON.stringify(data))
    }
  }

  return (
    <main>
      <h1>Mortgauge</h1>
      <p>Figure out what home you can actually afford.</p>

      <h2>What can I afford?</h2>
      <form onSubmit={handleAffordSubmit}>
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
        <button type="submit">Calculate affordability</button>
      </form>

      {affordResult && (
        <div className="result">
          <p><strong>Max home price: ${affordResult.max_home_price}</strong></p>
          <p>Max loan amount: ${affordResult.max_loan_amount}</p>
          <p>Max monthly payment (PITI): ${affordResult.max_monthly_piti}</p>
          <p>Debt-to-income ratio: {affordResult.dti_ratio}%</p>
        </div>
      )}
      {affordError && <p className="error">{affordError}</p>}

      <hr />

      <h2>Monthly payment</h2>
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
        <button type="submit">Calculate payment</button>
      </form>

      {result && (
        <div className="result">
          <p>Principal &amp; interest: ${result.principal_and_interest}</p>
          <p>Taxes (monthly): ${result.taxes}</p>
          <p>Insurance (monthly): ${result.insurance}</p>
          <p>HOA: ${result.hoa}</p>
          <p><strong>Total monthly (PITI): ${result.total}</strong></p>
        </div>
      )}
      {error && <p className="error">{error}</p>}

      <p className={`api-status ${apiStatus}`}>
        API: {apiStatus}
      </p>
    </main>
  )
}

export default App
