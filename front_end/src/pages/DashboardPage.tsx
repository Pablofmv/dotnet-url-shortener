import { useEffect, useState } from 'react'
import AnalyticsCard from '../components/AnalyticsCard'
import { API_BASE_URL } from '../api'
import './DashboardPage.css'

type UniqueVisitorsResponse = {
  uniqueVisitors: number
}

type ClicksBySubdomainResponse = {
  subdomain: string
  totalClicks: number
}

type UniqueVisitorsLast5DaysResponse = {
  day: string
  uniqueVisitors: number
}

function DashboardPage() {
  const [uniqueVisitors, setUniqueVisitors] = useState(0)

  const [clicksBySubdomain, setClicksBySubdomain] =
    useState<ClicksBySubdomainResponse[]>([])

  const [uniqueVisitorsLast5Days, setUniqueVisitorsLast5Days] =
    useState<UniqueVisitorsLast5DaysResponse[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const uniqueVisitorsResponse = await fetch(
          `${API_BASE_URL}/analytics/unique-visitors`
        )

        if (!uniqueVisitorsResponse.ok) {
          throw new Error('Failed to load analytics.')
        }

        const uniqueVisitorsData: UniqueVisitorsResponse =
          await uniqueVisitorsResponse.json()

        setUniqueVisitors(uniqueVisitorsData.uniqueVisitors)

        const clicksBySubdomainResponse = await fetch(
          `${API_BASE_URL}/analytics/clicks-by-subdomain`
        )

        if (!clicksBySubdomainResponse.ok) {
          throw new Error('Failed to load analytics.')
        }

        const clicksBySubdomainData: ClicksBySubdomainResponse[] =
          await clicksBySubdomainResponse.json()

        setClicksBySubdomain(clicksBySubdomainData)

        const uniqueVisitorsLast5DaysResponse = await fetch(
          `${API_BASE_URL}/analytics/unique-visitors-last-5-days`
        )

        if (!uniqueVisitorsLast5DaysResponse.ok) {
          throw new Error('Failed to load analytics.')
        }

        const uniqueVisitorsLast5DaysData:
          UniqueVisitorsLast5DaysResponse[] =
          await uniqueVisitorsLast5DaysResponse.json()

        setUniqueVisitorsLast5Days(
          uniqueVisitorsLast5DaysData
        )
      } catch {
        setError('Could not load analytics.')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const totalClicks = clicksBySubdomain.reduce(
    (total, row) => total + row.totalClicks,
    0
  )

  const today = new Date()

  const last5Days = Array.from({ length: 5 }, (_, index) => {
    const day = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() - (4 - index)
      )
    )

    const dayKey = day.toISOString().split('T')[0]

    const apiRow = uniqueVisitorsLast5Days.find(
      (row) => row.day.split('T')[0] === dayKey
    )

    return {
      day,
      uniqueVisitors: apiRow?.uniqueVisitors ?? 0,
    }
  })

  if (isLoading) {
    return <p>Loading analytics...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <main className="dashboard">
      <h1 className="dashboard-title">
        URL SHORTENER ANALYTICS
      </h1>

      <section className="dashboard-top">
        <div className="subdomains-panel">
          <h2>SUBDOMAINS METRICS</h2>

          {clicksBySubdomain.map((row) => {
            const percentage =
              totalClicks === 0
                ? 0
                : Math.round(
                    (row.totalClicks / totalClicks) * 100
                  )

            return (
              <div
                className="subdomain-item"
                key={row.subdomain}
              >
                <h3>{row.subdomain.toUpperCase()}</h3>
                <p>{percentage}%</p>
              </div>
            )
          })}
        </div>

        <div className="unique-visitors-panel">
          <AnalyticsCard
            title="UNIQUE VISITORS"
            value={uniqueVisitors}
          />
        </div>
      </section>

      <section className="last-five-days">
        <h2>LAST 5 DAYS UNIQUE VISITORS</h2>

        <div className="days-grid">
          {last5Days.map((row) => (
            <div key={row.day.toISOString()}>
              {row.day
                .toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'UTC',
                })
                .toUpperCase()}
            </div>
          ))}

          {last5Days.map((row) => (
            <div key={`${row.day.toISOString()}-value`}>
              {row.uniqueVisitors}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default DashboardPage