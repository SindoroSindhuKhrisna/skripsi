import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

export default function LoraConnectionIndicator() {
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <div className="ml-4 size-4 rounded-full bg-red-500 shadow-black shadow-sm"></div>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col rounded-xl w-52">
                    <div className="grid gap-4">
                        <div className="space-y-2 p-2 border-2 rounded-md">
                            <h4 className="font-medium leading-none">LoRa Device</h4>
                            <p className="text-sm text-muted-foreground">
                                COM8 - CH340
                            </p>
                        </div>
                        <div className="space-y-2 p-2 border-2 rounded-md">
                            <h4 className="font-medium leading-none">Connection</h4>
                            <p className="text-sm text-muted-foreground pb-2">
                                Great.
                            </p>
                            <div className="flex flex-row items-center gap-4">
                                <Label className="w-20">Signal</Label>
                                <div className="w-full">
                                    <Label>: </Label>
                                    <Label className="text-green-500">80%</Label>
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-4">
                                <Label className="w-20">Latency</Label>
                                <div className="w-full">
                                    <Label>: </Label>
                                    <Label className="text-green-500">5 ms</Label>
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-4">
                                <Label className="w-20">Loss</Label>
                                <div className="w-full">
                                    <Label>: </Label>
                                    <Label className="text-green-500">0 %</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover >
        </>
    )
}