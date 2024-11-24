"use client"

import * as React from "react"
import { ChevronDown, ChevronsUpDown, Ellipsis } from "lucide-react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const data: DataTablePolisiPendaftaran[] = [
    {
        id: "m5gr84i9",
        tglDaftar: "2024-01-01",
        layanan: "Duplikat STNK",
        nopol: "H / DB 1002 LO",
        nama: "YANTI MAHDIJAH HASAN",
        alamat: "KEL BANJER LK V",
        jmt: "MINIBUS / TOYOTA / AVANZA 1300 G (F601RM GMMFJJ)",
        proses: 3
    },
    {
        id: "m5gr84j9",
        tglDaftar: "2024-02-01",
        layanan: "Perpanjangan STNK",
        nopol: "H / DB 1003 LO",
        nama: "PT JASA RAHARJA PERSERO CAB SULUT",
        alamat: "KEL SARIO TUMPAAN NO 25-27",
        jmt: "SEPEDA MOTOR RODA 2 / HONDA / ACB2J22B03 A/T",
        proses: 4
    },
    {
        id: "m5gr84k9",
        tglDaftar: "2024-03-01",
        layanan: "Pengesahan Tiap Tahun",
        nopol: "H / DB 1004 LO",
        nama: "VICTOR CHRISTIAN SALEM LIMBAT",
        alamat: "KEL WENANG SELATAN LK I",
        jmt: "LIGHT TRUCK / HINO / WU342R-HKMQHD3 (110LD)",
        proses: 1
    },
    {
        id: "m5gr84l9",
        tglDaftar: "2024-04-01",
        layanan: "Pengesahan Tiap Tahun",
        nopol: "H / DB 1005 LO",
        nama: "PT JASA RAHARJA PERSERO CAB SULUT",
        alamat: "JL. SAM RATULANGI NOMOR 66 KEL. WENANG SELATAN LK. I KEC. WENANG - MANADO",
        jmt: "SEPEDA MOTOR RODA 2 / HONDA / ACB2J22B03 A/T",
        proses: 2
    },
]


export type DataTablePolisiPendaftaran = {
    id: string
    tglDaftar: string
    layanan: string
    nopol: string
    nama: string
    alamat: string
    jmt: String
    proses: ProsesLayanan
}

export type ProsesLayanan = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type ColumnNameMap = {
    tglDaftar: string;
    layanan: string;
    nopol: string;
    nama: string;
    alamat: string;
    jmt: string;
    proses: string;
}

export const columnNameMap = {
    tglDaftar: "Tgl Daftar",
    layanan: "Jenis Layanan",
    nopol: "NRKB",
    nama: "Nama Pemilik",
    alamat: "Alamat Pemilik",
    jmt: "J/M/T",
    proses: "Proses",
}

export const processNameMap = {
    1: {
        name: "Didaftar",
        color: "border-red-500 bg-red-300 dark:bg-red-900",
    },
    2: {
        name: "Diteliti",
        color: "border-red-500 bg-red-300 dark:bg-red-900",
    },
    3: {
        name: "Tap SWDKLLJ",
        color: "border-blue-500 bg-cyan-400 dark:bg-blue-900",
    },
    4: {
        name: "Tap PKB BBNKB",
        color: "border-green-500 bg-green-400 dark:bg-green-900",
    },
    5: {
        name: "Disetujui",
        color: "border-blue-500 bg-cyan-400 dark:bg-blue-900",
    },
    6: {
        name: "Terbayar",
        color: "border-blue-500 bg-cyan-400 dark:bg-blue-900",
    },
    7: {
        name: "Dicetak",
        color: "border-blue-500 bg-cyan-400 dark:bg-blue-900",
    }
}

export const columns: ColumnDef<DataTablePolisiPendaftaran>[] = [
    {
        accessorKey: "tglDaftar",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="pl-0"
                >
                    Tgl Daftar
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{row.getValue("tglDaftar")}</div>,
    },
    {
        accessorKey: "layanan",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="pl-0"
                >
                    Jenis Layanan
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{row.getValue("layanan")}</div>,
    },
    {
        accessorKey: "nopol",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="pl-0"
                >
                    NRKB
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{row.getValue("nopol")}</div>,
    },
    {
        accessorKey: "nama",
        header: "Nama Pemilik",
        cell: ({ row }) => <div className="">{row.getValue("nama")}</div>,
    },
    {
        accessorKey: "alamat",
        header: "Alamat Pemilik",
        cell: ({ row }) => <div className="">{row.getValue("alamat")}</div>,
    },
    {
        accessorKey: "jmt",
        header: "J/M/T",
        cell: ({ row }) => <div className="">{row.getValue("jmt")}</div>,
    },
    {
        accessorKey: "proses",
        header: "Proses",
        cell: ({ row }) => (
            <div className={`flex text-center items-center justify-center p-1 capitalize border-2 ${processNameMap[row.getValue("proses") as ProsesLayanan]?.color ?? "border-gray-500 bg-gray-500 dark:bg-gray-900"} rounded-md`}>
                {processNameMap[row.getValue("proses") as ProsesLayanan]?.name ?? "Tidak Diketahui"}
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Ellipsis className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Hapus Pendaftaran
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function DataTablePolisiPendaftaran() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter NRKB..."
                    value={(table.getColumn("nopol")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("nopol")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm border border-gray-900 dark:border-gray-500"
                />
                {/* Columns Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto border border-gray-900 dark:border-gray-500">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {columnNameMap[column.id as keyof ColumnNameMap] ?? 'ERROR!!!'}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border border-gray-900 dark:border-gray-500">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="border border-gray-900 dark:border-gray-500"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="border border-gray-900 dark:border-gray-500"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
