import { deleteURL, getAnalytics } from "~/server/queries";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import CountryChart from "./country-chart";
import DeviceChart from "./device-chart";
import { QrCode } from "./qr-code";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import LogTable from "./log-table";


interface AnalyticsProps {
    shortcode: string;
}

export default async function Analytics({ shortcode }: AnalyticsProps) {
    const analytics = await getAnalytics(shortcode);
    const shortened_url = "https://" + process.env.NEXT_PUBLIC_URL + '/' + shortcode;

    return (
        <div className="container mx-auto p-4">
            <div className="flex gap-x-3">
                <Link href="/">
                    <Button variant="outline">
                        <ArrowLeft />
                    </Button>
                </Link>

                <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl"> Information </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col ">
                        <div className="mb-1">
                            <div className="mb-6">
                                <h1 className="text-lg font-semibold text-gray-800 mb-2">Original URL:</h1>
                                <Link href={analytics.original_url} target='_blank' className='text-blue-500 text-sm truncate'>
                                    {analytics.original_url}
                                </Link>
                            </div>
                            <div className="mb-6">
                                <h1 className="text-lg font-semibold text-gray-800 mb-2">Shortened URL:</h1>
                                <Link href={shortened_url} target='_blank' className='text-blue-500 text-sm truncate'>
                                    {shortened_url}
                                </Link>
                            </div>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="w-32">Delete URL</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Are you sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. The shortened URL and all data associated with it will be permanently deleted.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center space-x-2">

                                </div>
                                <DialogFooter className="sm:justify-between">
                                    <DialogClose asChild>
                                        <div className="flex">
                                            <Button type="button" variant="outline">
                                                Go Back
                                            </Button>

                                        </div>
                                    </DialogClose>
                                    <form action={deleteURL}>
                                        <input type="hidden" name="shortcode" value={shortcode} />
                                        <Button type="submit" variant="destructive">
                                            Delete
                                        </Button>
                                    </form>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">QR Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <QrCode shortened_url={shortened_url} />
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-xl">Recent Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <LogTable shortcode={shortcode}></LogTable>
                </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Total Visits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-semibold">{analytics.KPI.total_visits}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Unique Visits</CardTitle>
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
                        <CardTitle className="text-xl">Country Visits</CardTitle>
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
                        <CardTitle className="text-xl">Device Visits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <DeviceChart deviceData={analytics.device_visits} />
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
