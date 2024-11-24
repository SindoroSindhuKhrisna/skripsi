import DashboardLayout from "@/app/dashboard/layout";
import { DashboardBreadcrump } from '@/components/dashboard/breadcrump';
import DashboardPolisiPendaftaranAddRegistration from "./addRegistration";
import { DataTablePolisiPendaftaran } from "@/components/dashboard/table/polisi/pendaftaran";

export default function DashboardPolisiPendaftaran() {
    return (
        <DashboardLayout>
            <div className="flex items-center px-4 w-full h-12 border-b-2 border-gray-900 dark:border-gray-500">
                <h1 className="font-semibold text-2xl">Pendaftaran</h1>
            </div>
            <div className="flex flex-col p-10 w-full h-[calc(100dvh-128px)] overflow-y-scroll gap-y-2">
                <DashboardPolisiPendaftaranAddRegistration />
                <DataTablePolisiPendaftaran />
            </div>
        </DashboardLayout>
    )
}