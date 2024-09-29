"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Access = {
    accessedAt: Date
    userAgent: string
    referrer: string | null
    ipAddress: string | null
    country: string | null
    city: string | null
    region: string | null
}

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("de-DE", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export const columns: ColumnDef<Access>[] = [
    {
        accessorKey: "accessedAt",
        header: "Accessed At",
        cell: ({ getValue }) => formatDate(getValue() as Date),
    },
    {
        accessorKey: "ipAddress",
        header: "IP Address",
    },
    {
        accessorKey: "userAgent",
        header: "User Agent",
    },
    {
        accessorKey: "referrer",
        header: "Referrer",
    },
    {
        accessorKey: "country",
        header: "Country",
    },
    {
        accessorKey: "city",
        header: "City",
    },
    {
        accessorKey: "region",
        header: "Region",
    },

]

