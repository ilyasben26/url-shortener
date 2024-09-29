import { getRecentAccessLogs } from "~/server/queries";
import { DataTable } from "./log-table-client";
import { columns } from "./log-table-columns";

interface LogTableProps {
    shortcode: string;
}


export default async function LogTable({ shortcode }: LogTableProps) {

    let table_data = null;

    try {
        table_data = await getRecentAccessLogs(shortcode);
    } catch (error) {
        console.error('Error loading fetching Access Logs:', error);
        return <p className='text-red-500 text-center'>Error while fetching access logs. Please try again later.</p>;
    }


    return (
        <DataTable columns={columns} data={table_data} />
    )
}