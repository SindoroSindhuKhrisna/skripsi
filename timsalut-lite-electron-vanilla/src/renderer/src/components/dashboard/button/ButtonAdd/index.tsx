import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ButtonAdd({ onClick }: { onClick?: any }) {
    return (
        <Button onClick={onClick} variant="default" className="w-36 aspect-[2/1] text-black dark:text-white bg-transparent dark:hover:text-black dark:bg-transparent border border-gray-900 dark:border-gray-500">
            <Plus className="h-5 w-5 mr-2" />
            <p className="text-lg mr-2">Tambah</p>
        </Button>
    )
}