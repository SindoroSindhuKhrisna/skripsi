import LoraConnectionIndicator from "@/components/dashboard/indicator/loraConnectionIndicator"
import { ThemeToggle } from "@/components/theme-provider/theme-toggle-button"
import { AvatarHeader } from "@/components/dashboard/avatar"

export default function Header() {
    return (
        <div className="sticky top-0 w-full h-20 flex justify-between items-center px-4 border-b-2 border-gray-900 dark:border-gray-500 bg-transparent">
            <h1 className="flex flex-row text-2xl items-center font-bold text-gray-900 dark:text-gray-100">
                Timsalut&nbsp;
                <p className="font-light">Lite</p>
                <LoraConnectionIndicator />
            </h1>
            <div className="flex gap-4 items-center">
                <ThemeToggle />
                <AvatarHeader />
            </div>
        </div>
    )
}