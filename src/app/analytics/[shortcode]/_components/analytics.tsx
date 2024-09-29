import { getAnalytics } from "~/server/queries";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import CountryChart from "./country-chart";
import DeviceChart from "./device-chart";
import { QrCode } from "./qr-code";

interface AnalyticsProps {
    shortcode: string;
}

export default async function Analytics({ shortcode }: AnalyticsProps) {
    const analytics = await getAnalytics(shortcode);
    const shortened_url = "https://" + process.env.NEXT_PUBLIC_URL + '/' + shortcode;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle> QR Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <QrCode shortened_url={shortened_url} />
                    </CardContent>
                </Card>
            </div>


            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Visits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-semibold">{analytics.KPI.total_visits}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Unique Visits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-semibold">
                            {analytics.KPI.total_unique_visits}
                        </p>
                    </CardContent>
                </Card>

            </div>


            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Country Visits Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Country Visits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <CountryChart countryData={analytics.country_visits} />
                        </div>
                    </CardContent>
                </Card>

                {/* Device Visits Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Device Visits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <DeviceChart deviceData={analytics.device_visits} />
                        </div>
                    </CardContent>
                </Card>
                {/* TODO: Delete Shortened URL  */}

            </div>
        </div>
    );
}
