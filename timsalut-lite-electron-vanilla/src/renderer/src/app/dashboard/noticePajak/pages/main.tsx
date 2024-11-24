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
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

    const generatePDF = (data: CetakNoticeData) => {
        // Initialize PDF
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.text('NOTICE PAJAK', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
        
        // Add header info
        doc.setFontSize(12);
        const startY = 40;
        const leftMargin = 20;
        const lineHeight = 8;
        
        // Header section
        doc.text(`No. Pajak: ${data.np || '-'}`, leftMargin, startY);
        doc.text(`Nama: ${data.n || '-'}`, leftMargin, startY + lineHeight);
        doc.text(`Alamat: ${data.a || '-'}`, leftMargin, startY + (lineHeight * 2));
        doc.text(`Jenis: ${data.j || '-'}`, leftMargin, startY + (lineHeight * 3));
        doc.text(`Merk: ${data.m || '-'}`, leftMargin, startY + (lineHeight * 4));
        doc.text(`Tipe: ${data.t || '-'}`, leftMargin, startY + (lineHeight * 5));
        doc.text(`Warna: ${data.w || '-'}`, leftMargin, startY + (lineHeight * 6));

        // Create table for financial details
        const tableData = [
            ['Keterangan', 'Pokok', 'Denda'],
            ['PKB', formatRupiah(data.pkb), formatRupiah(data.pkbd)],
            ['SW', formatRupiah(data.sw), formatRupiah(data.swd)],
            ['TOL', formatRupiah(data.top), formatRupiah(data.tod)],
        ];

        // Add table
        (doc as any).autoTable({
            startY: startY + (lineHeight * 8),
            head: [tableData[0]],
            body: tableData.slice(1),
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            styles: { fontSize: 10, cellPadding: 5 },
            margin: { left: leftMargin },
        });

        // Add total
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFont('helvetica', 'bold');
        doc.text(`Total: ${formatRupiah(data.tot)}`, doc.internal.pageSize.getWidth() - 20, finalY, { align: 'right' });

        // Save the PDF
        const fileName = `notice_pajak_${data.np || 'unknown'}_${new Date().getTime()}.pdf`;
        doc.save(fileName);
    };

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
                            <Button type="submit" onClick={() => generatePDF(cetakNoticeData)}>Cetak</Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}