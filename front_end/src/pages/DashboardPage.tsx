import { useState} from 'react';
import AnalyticsCard from '../components/AnalyticsCard';


function DashboardPage() 
{
    const [uniqueVisitors] = useState(125)

    return (
        <main>
            <h1>URL Shortener Analytics</h1>

            <AnalyticsCard 
                title = "Unique Visitors"
                value = {uniqueVisitors}
            />
        </main>
    )
}

export default DashboardPage