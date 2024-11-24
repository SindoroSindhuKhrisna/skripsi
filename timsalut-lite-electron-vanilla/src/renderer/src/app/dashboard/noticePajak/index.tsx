import DashboardLayout from "@/app/dashboard/layout";
import DashboardCetakNoticeMain from "./pages/main";

export default function DashboardCetakNotice() {
    return (
        <DashboardLayout>
            <div className="flex items-center px-4 w-full h-12 border-b-2 border-gray-900 dark:border-gray-500">
                <h1 className="font-semibold text-2xl">Cetak Notice Pajak</h1>
            </div>
            <div className="flex flex-col p-10 w-full h-[calc(100dvh-128px)] overflow-y-scroll gap-y-2">
                <DashboardCetakNoticeMain/>
            </div>
        </DashboardLayout>
    )
}