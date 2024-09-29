/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CountryChart({ countryData }: { countryData: Record<string, number> }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        // Prepare chart data
        const labels = Object.keys(countryData);
        const values = Object.values(countryData);

        setChartData({
            labels,
            datasets: [
                {
                    label: '# of Visits',
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        });
    }, [countryData]);


    return (
        <div style={{ maxWidth: '400px', maxHeight: '400px', margin: '0 auto' }}>
            {chartData ? <Pie data={chartData} width={300} height={300} /> : <p>Loading chart...</p>}
        </div>
    );
}
