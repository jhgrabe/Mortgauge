import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // 'checking' until the request finishes, then 'ok' or 'unreachable'
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    fetch('/api/health/')
      .then((response) => response.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('unreachable'))
  }, [])

  return (
    <main>
      <h1>Homeward</h1>
      <p>Figure out what home you can actually afford.</p>
      <p className={`api-status ${apiStatus}`}>
        API: {apiStatus}
      </p>
    </main>
  )
}

export default App
