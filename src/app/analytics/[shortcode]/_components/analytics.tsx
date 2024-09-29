import { getAnalytics } from "~/server/queries";

// fetch the actual entry associated with the shortcode
interface AnalyticsProps {
    shortcode: string;
}


export default async function Analytics({ shortcode }: AnalyticsProps) {

    const analytics = await getAnalytics(shortcode);

    console.log(analytics);

    return (
        <div>
            <h1>My Analytics Page</h1>
            <p>{analytics.original_url}</p>
            <p>Total visits: {analytics.KPI.total_visits}</p>
        </div>

    )
}