import { useState, useEffect } from 'react';
import AnalyticsCard from '../components/AnalyticsCard';
import { API_BASE_URL } from '../api';
import "./DashboardPage.css"

type UniqueVisitorsResponse = {
    uniqueVisitors: number
}

type ClicksBySubdomainResponse = {
  subdomain : string 
  totalClicks : number
}

type UniqueVisitorsLast5DaysResponse = {
  day: string
  uniqueVisitors : number
}


function DashboardPage() 
{
    const [uniqueVisitors, setUniqueVisitors ] = useState(0)

    const [clicksBySubdomain, setClicksBySubdomain] = useState<ClicksBySubdomainResponse[]>([])

    const [uniqueVisitorsLast5Days, setUniqueVisitorsLast5Days] = useState<UniqueVisitorsLast5DaysResponse[]>([])


    useEffect(() => {
        async function loadUniqueVisitors() {
            const response = await fetch(
                `${API_BASE_URL}/analytics/unique-visitors`
            )

            const data: UniqueVisitorsResponse = await response.json()

            setUniqueVisitors(data.uniqueVisitors)
        }

        async function loadClicksBySubdomain() {
          const response = await fetch(
            `${API_BASE_URL}/analytics/clicks-by-subdomain`
          )

          const data: ClicksBySubdomainResponse[] = await response.json()

          setClicksBySubdomain(data)
        }

        async function loadUniqueVisitorsLast5Days() {
          const response = await fetch(
            `${API_BASE_URL}/analytics/unique-visitors-last-5-days`
          )

          const data: UniqueVisitorsLast5DaysResponse[] = await response.json()

          setUniqueVisitorsLast5Days(data)
        }

        loadUniqueVisitors()
        loadClicksBySubdomain()
        loadUniqueVisitorsLast5Days()
        
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