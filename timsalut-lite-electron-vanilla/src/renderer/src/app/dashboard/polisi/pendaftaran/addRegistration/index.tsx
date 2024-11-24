import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ButtonAdd from "@/components/dashboard/button/ButtonAdd"
import { toast } from "@/hooks/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const FormSchema = z.object({
    np1: z.string(),
    np2: z.string(),
    np3: z.string(),
    wtnkb: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

export default function DashboardPolisiPendaftaranAddRegistration() {
    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            np1: "DB",
            np2: "",
            np3: "",
            wtnkb: "P",
        },
    })

    function onSubmit(data: FormValues) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <ButtonAdd />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Form Pendaftaran</DialogTitle>
                    <DialogDescription>
                        Pastikan Warna TNKB dan NRKB Benar.
                    </DialogDescription>
                </DialogHeader>
                <div className="">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row w-full items-end justify-center gap-x-2">
                            <FormField
                                control={form.control}
                                name="np1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>NRKB</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-[80px]">
                                                    <SelectValue placeholder="Kode Wilayah" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="min-w-[80px] w-[80px]">
                                                <SelectItem value="DB">DB</SelectItem>
                                                <SelectItem value="DL">DL</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="np2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>&nbsp;</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1234" {...field} className="w-[80px] text-center" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="np3"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>&nbsp;</FormLabel>
                                        <FormControl>
                                            <Input placeholder="A" {...field} className="w-[80px] text-center" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="wtnkb"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Warna TNKB</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-[100px]">
                                                    <SelectValue placeholder="Warna TNKB" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="min-w-[100px] w-[100px]">
                                                <SelectItem value="P">Putih</SelectItem>
                                                <SelectItem value="H">Hitam</SelectItem>
                                                <SelectItem value="K">Kuning</SelectItem>
                                                <SelectItem value="M">Merah</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="ml-4 w-[80px]">Cari</Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}