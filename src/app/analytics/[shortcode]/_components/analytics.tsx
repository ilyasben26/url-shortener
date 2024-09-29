import { getAnalytics } from "~/server/queries";

interface AnalyticsProps {
    shortcode: string;
}

export default async function Analytics({ shortcode }: AnalyticsProps) {

    const analytics = await getAnalytics(shortcode);

    console.log(analytics);

    return (
        <div>
            <h1>My Analytics Page</h1>

        </div>

    )
}