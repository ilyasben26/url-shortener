/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    TooltipItem,
    TooltipModel,
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DeviceChartProps {
    deviceData: Record<string, number>;
}

export default function DeviceChart({ deviceData }: DeviceChartProps) {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        // Prepare chart data
        const labels = Object.keys(deviceData).map(device => truncateString(device));
        const values = Object.values(deviceData);

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
    }, [deviceData]);

    // Function to truncate long strings
    const truncateString = (str: string, maxLength = 30) => {
        return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
    };

    // Custom tooltip
    const tooltipOptions = {
        callbacks: {
            label: (tooltipItem: TooltipItem<'pie'>) => {
                const value = tooltipItem.raw as number;

                // Access full label using the index property
                const fullLabel = Object.keys(deviceData)[tooltipItem.dataIndex];

                return `${fullLabel}: ${value}`; // Show full label in tooltip
            },
        },
    };

    return (
        <div style={{ maxWidth: '400px', maxHeight: '400px', margin: '0 auto' }}>
            {chartData ? (
                <Pie data={chartData} options={{ plugins: { tooltip: tooltipOptions } }} />
            ) : (
                <p>Loading chart...</p>
            )}
        </div>
    );
}
