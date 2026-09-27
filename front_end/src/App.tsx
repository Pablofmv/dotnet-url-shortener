import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import './App.css'

function App()
{
  const path = window.location.pathname

  if (path === "/dashboard")
  {
    return <DashboardPage />
  }

  return <HomePage />
}

export default App