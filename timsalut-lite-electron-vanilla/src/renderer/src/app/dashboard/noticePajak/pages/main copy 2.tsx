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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCaption,
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

interface VehicleData {
    s: number;
    np: string;
    n: string;
    a: string;
    j: string;
    m: string;
    t: string;
    w: string;
    b: string;
    nm: string;
    nr: string;
    mil: string;
    jtpj: string;
    jtbr: string;
    tht: string;
    pkb: number;
    pkbd: number;
    sw: number;
    swd: number;
    jml: number;
}

interface InformationData {
    s: number;
    m: string;
}

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
    }).format(number)
    .replace('IDR', 'Rp.')  // Replace IDR with Rp.
    .replace(',', '.');     // Replace comma with dot for Indonesian style
};

export default function DashboardCetakNoticeMain() {
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);
    const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
    const [informationData, setInformationData] = useState<InformationData | null>(null);
    const [chassisLastDigits, setChassisLastDigits] = useState<string>('');
    const [confirmationResponse, setConfirmationResponse] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            kdbill: "",
        },
    })

    async function onSubmit(data: FormValues) {
        setIsLoading(true);
        setVehicleData(null);
        setInformationData(null);
        setConfirmationResponse(null);

        let requestJSONBody = {
            apiSelect: "online/searchRanmor",
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

            const result = await response.json();

            if (result.s === 200) {
                setVehicleData(result);
            } else {
                setInformationData(result);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to connect to the server",
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function onConfirm() {
        // Validate chassis last digits
        if (!chassisLastDigits || chassisLastDigits.length !== 5) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Nomor Rangka harus 5 digit",
            });
            return;
        }

        // Ensure vehicle data exists before confirmation
        if (!vehicleData) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Silakan cari data kendaraan terlebih dahulu",
            });
            return;
        }

        setIsConfirmLoading(true);

        try {
            const confirmData = {
                apiSelect: "online/tap",
                body: {
                    kdbill: form.getValues('kdbill')
                }
            };

            // http://10.30.1.11:8000/online/tap
            const response = await fetch('http://192.168.4.1/API', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(confirmData),
            });

            const result = await response.json();
            console.log(result.s);
            if (result.s == 200) {
                // Hide vehicle data and show confirmation response
                setVehicleData(null);
                setConfirmationResponse("Konfirmasi berhasil, Kode Bayar: " + result.kb);
                // toast({
                //     title: "Sukses",
                //     description: "Konfirmasi berhasil, Kode Bayar: " + result.kb,
                // });
            } else {
                setConfirmationResponse(result.m || "Konfirmasi gagal");
                // toast({
                //     variant: "destructive",
                //     title: "Error",
                //     description: result.m || "Konfirmasi gagal",
                // });
            }
        } catch (error) {
            setConfirmationResponse("Gagal terhubung ke server");
            toast({
                variant: "destructive",
                title: "Error",
                description: "Gagal terhubung ke server",
            });
        } finally {
            setIsConfirmLoading(false);
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
                            name="kd_byr"
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

                {vehicleData && !confirmationResponse && (
                    <Table className='w-full'>
                        <TableHeader>
                            <TableRow>
                            <TableHead colSpan={2} className="w-[200px] text-center text-xl text-black dark:text-white border border-gray-800 dark:border-gray-200">Informasi Kendaraan</TableHead>
                            <TableHead colSpan={2} className="w-[200px] text-center text-xl text-black dark:text-white border border-gray-800 dark:border-gray-200">Informasi Tagihan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Nomor Polisi</TableCell>
                                <TableCell className='border border-gray-800 dark:border-gray-200'>{vehicleData.np}</TableCell>
                                <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>Jatuh Tempo Pajak</TableCell>
                                <TableCell className="text-right border border-gray-800 dark:border-gray-200">{vehicleData.jtpj}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Nama Pemilik</TableCell>
                                <TableCell className='border border-gray-800 dark:border-gray-200'>{vehicleData.n}</TableCell>
                                <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>Jatuh Berikutnya</TableCell>
                                <TableCell className="text-right border border-gray-800 dark:border-gray-200">{vehicleData.jtbr}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Alamat</TableCell>
                                <TableCell className='border border-gray-800 dark:border-gray-200'>{vehicleData.a}</TableCell>
                                <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>Tahun Tagihan</TableCell>
                                <TableCell className="text-right border border-gray-800 dark:border-gray-200">{vehicleData.tht}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Jenis Kendaraan</TableCell>
                                <TableCell className='border border-gray-800 dark:border-gray-200'>{vehicleData.j}</TableCell>
                                <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>PKB</TableCell>
                                <TableCell className="text-right border border-gray-800 dark:border-gray-200">{formatRupiah(vehicleData.pkb)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Merk</TableCell>
                                <TableCell className='border border-gray-800 dark:border-gray-200'>{vehicleData.m}</TableCell>
                                <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>Denda PKB</TableCell>
                                <TableCell className="text-right border border-gray-800 dark:border-gray-200">{formatRupiah(vehicleData.pkbd)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Tipe</TableCell>
                                <TableCell className='border border-gray-800 dark:border-gray-200'>{vehicleData.t}</TableCell>
                                <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>SWDKLLJ</TableCell>
                                <TableCell className="text-right border border-gray-800 dark:border-gray-200">{formatRupiah(vehicleData.sw)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Warna</TableCell>
                                <TableCell className='border border-gray-800 dark:border-gray-200'>{vehicleData.w}</TableCell>
                                <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>Denda SWDKLLJ</TableCell>
                                <TableCell className="text-right border border-gray-800 dark:border-gray-200">{formatRupiah(vehicleData.swd)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Tahun</TableCell>
                                <TableCell className='border border-gray-800 dark:border-gray-200'>{vehicleData.b}</TableCell>
                                <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>Jumlah Tagihan</TableCell>
                                <TableCell className="text-right border border-gray-800 dark:border-gray-200">{formatRupiah(vehicleData.jml)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Nomor Rangka</TableCell>
                                <TableCell className='border border-gray-800 dark:border-gray-200'>{vehicleData.nr}</TableCell>
                                <TableCell className='font-bold border border-gray-800 dark:border-gray-200'>5 Digit Terakhir Nomor Rangka</TableCell>
                                <TableCell className="text-right border border-gray-800 dark:border-gray-200">
                                    <Input 
                                        value={chassisLastDigits}
                                        onChange={(e) => setChassisLastDigits(e.target.value)}
                                        maxLength={5}
                                        className='border border-white text-end'
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold border border-gray-800 dark:border-gray-200">Nomor Mesin</TableCell>
                                <TableCell className='border border-gray-800 dark:border-gray-200'>{vehicleData.nm}</TableCell>
                                <TableCell colSpan={2} className='border border-gray-800 dark:border-gray-200'>
                                    <div className="flex flex-row justify-between items-center px-2 gap-x-2">
                                        <p className='text-center max-w-96'>Pastikan jumlah tertera sesuai dengan semestinya dan masukkan 5 digit terakhir nomor rangka sebelum mengonfirmasi</p>
                                        <Button onClick={onConfirm} disabled={isConfirmLoading}>
                                            {isConfirmLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Konfirmasi"}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                )}

                {(informationData || confirmationResponse) && (
                    <div className="flex justify-center items-center p-8 bg-gray-100 rounded-lg">
                        <p className='flex text-center text-lg font-semibold'>
                            {confirmationResponse || informationData?.m}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}