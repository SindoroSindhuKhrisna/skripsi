import Header from '@/components/dashboard/header'
import Sidebar from '@/components/dashboard/sidebar'

export default function DashboardLayout({
    children,
}: Readonly<{
    children?: React.ReactNode;
}>): JSX.Element {

    return (
        <main className="flex flex-col h-full min-h-screen items-center bg-red-200 dark:bg-red-950">
            <Header />
            <div className="flex flex-row size-full bg-neutral-200 dark:bg-neutral-950">
                <div className="h-[calc(100dvh-80px)] min-w-72 w-72 max-w-72">
                    <Sidebar />
                </div>
                <div className="flex flex-col size-full">
                    {children}
                </div>
            </div>
        </main>
    )
}
