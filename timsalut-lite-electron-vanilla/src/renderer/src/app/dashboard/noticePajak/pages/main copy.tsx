import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Loader2 } from "lucide-react"

const FormSchema = z.object({
    kdbill: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

interface CetakNoticeData {
    s: number;
    m?: string;
    np?: string;
    n?: string;
    a?: string;
    j?: string;
    m?: string;
    t?: string;
    w?: string;
    pkb?: number;
    pkbd?: number;
    sw?: number;
    swd?: number;
    top?: number;
    tod?: number;
    tot?: number;
}

const formatRupiah = (number?: number) => {
    if (number === undefined) return '-';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number)
    .replace('IDR', 'Rp.')
    .replace(',', '.');
};

export default function DashboardCetakNoticeMain() {
    const [isLoading, setIsLoading] = useState(false);
    const [cetakNoticeData, setCetakNoticeData] = useState<CetakNoticeData | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            kdbill: "",
        },
    })

    async function onSubmit(data: FormValues) {
        setIsLoading(true);
        setCetakNoticeData(null);
        setErrorMessage(null);

        let requestJSONBody = {
            apiSelect: "online/searchCetak",
            body: data
        }

        try {
            const response = await fetch('http://192.168.4.1/API', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestJSONBody),
            });

            const result: CetakNoticeData = await response.json();

            if (result.s === 200) {
                // Success case
                setCetakNoticeData({
                    s: result.s,
                    np: result.np,
                    n: result.n,
                    a: result.a,
                    j: result.j,
                    m: result.m,
                    t: result.t,
                    w: result.w,
                    pkb: result.pkb,
                    pkbd: result.pkbd,
                    sw: result.sw,
                    swd: result.swd,
                    top: result.top,
                    tod: result.tod,
                    tot: result.tot,
                });
            } else {
                // Error case
                setErrorMessage(result.m || "Data notice pajak tidak ditemukan");
            }
        } catch (error) {
            setErrorMessage("Gagal terhubung ke server");
            toast({
                variant: "destructive",
                title: "Error",
                description: "Gagal terhubung ke server",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col size-full items-center justify-center p-6">
            <div className="flex w-full justify-center mb-6 text-2xl">
                FORM CETAK NOTICE PAJAK
            </div>
            <div className="w-full max-w-6xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row w-full items-end justify-center gap-x-2 mb-8">
                        <FormField
                            control={form.control}
                            name="kdbill"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kode Bayar</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0123456789" {...field} className="w-[300px] text-center" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="ml-4 w-[80px]" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cari"}
                        </Button>
                    </form>
                </Form>

                {isLoading && (
                    <div className="flex justify-center items-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                )}

                {errorMessage && (
                    <div className="flex justify-center items-center p-4 bg-red-100 text-red-800 rounded-lg mb-4">
                        {errorMessage}
                    </div>
                )}

                {cetakNoticeData && cetakNoticeData.s === 200 && (
                    <>
                        <div className="flex justify-center items-center p-4 gap-x-20 bg-green-100 text-green-800 rounded-lg mb-4">
                            <p className="text-center text-xl font-bold">Siap dicetak</p>
                            <Button type="submit" onClick={() => window.print()}>Cetak</Button>
                        </div>
                        {/* <Table className='w-full'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead colSpan={2} className="w-[200px] text-center text-xl text-black dark:text-white border border-gray-800 dark:border-gray-200">
                                        Informasi Kendaraan
                                    </TableHead>
                                    <TableHead colSpan={2} className="w-[200px] text-center text-xl text-black dark:text-white border border-gray-800 dark:border-gray-200">
                                        Informasi Pembayaran
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Nomor Polisi</TableCell>
                                    <TableCell className='border border-gray-800 dark:border-gray-200'>{cetakNoticeData.np}</TableCell>
                                    <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>PKB</TableCell>
                                    <TableCell className="text-right border border-gray-800 dark:border-gray-200">{formatRupiah(cetakNoticeData.pkb)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Nama Pemilik</TableCell>
                                    <TableCell className='border border-gray-800 dark:border-gray-200'>{cetakNoticeData.n}</TableCell>
                                    <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>Denda PKB</TableCell>
                                    <TableCell className="text-right border border-gray-800 dark:border-gray-200">{formatRupiah(cetakNoticeData.pkbd)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Alamat</TableCell>
                                    <TableCell className='border border-gray-800 dark:border-gray-200'>{cetakNoticeData.a}</TableCell>
                                    <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>SWDKLLJ</TableCell>
                                    <TableCell className="text-right border border-gray-800 dark:border-gray-200">{formatRupiah(cetakNoticeData.sw)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Jenis Kendaraan</TableCell>
                                    <TableCell className='border border-gray-800 dark:border-gray-200'>{cetakNoticeData.j}</TableCell>
                                    <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>Denda SWDKLLJ</TableCell>
                                    <TableCell className="text-right border border-gray-800 dark:border-gray-200">{formatRupiah(cetakNoticeData.swd)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Merk</TableCell>
                                    <TableCell className='border border-gray-800 dark:border-gray-200'>{cetakNoticeData.m}</TableCell>
                                    <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>Total Pokok</TableCell>
                                    <TableCell className="text-right border border-gray-800 dark:border-gray-200">{formatRupiah(cetakNoticeData.top)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Tipe</TableCell>
                                    <TableCell className='border border-gray-800 dark:border-gray-200'>{cetakNoticeData.t}</TableCell>
                                    <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>Total Denda</TableCell>
                                    <TableCell className="text-right border border-gray-800 dark:border-gray-200">{formatRupiah(cetakNoticeData.tod)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Warna</TableCell>
                                    <TableCell className='border border-gray-800 dark:border-gray-200'>{cetakNoticeData.w}</TableCell>
                                    <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>Total Tagihan</TableCell>
                                    <TableCell className="text-right border border-gray-800 dark:border-gray-200">{formatRupiah(cetakNoticeData.tot)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table> */}
                    </>
                )}
            </div>
        </div>
    )
}