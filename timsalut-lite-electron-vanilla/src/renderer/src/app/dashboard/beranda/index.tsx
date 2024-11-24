import DashboardLayout from "@/app/dashboard/layout";

export default function DashboardBeranda() {
    return (
        <DashboardLayout>
            <div className="flex flex-col w-full h-[calc(100dvh-80px)] overflow-y-auto">
                <div className="flex flex-col w-full h-full items-center justify-center">
                    <h1 className="text-4xl font-bold">Welcome to Timsalut Lite</h1>
                    <p className="text-lg font-light">LoRa Infrastructure Technology Edition</p>
                </div>
            </div>
        </DashboardLayout>
    )
}