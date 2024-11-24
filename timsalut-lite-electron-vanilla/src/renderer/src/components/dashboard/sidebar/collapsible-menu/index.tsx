"use client"
import * as React from "react"
import { ChevronDown, ChevronUp, CircleAlert, LucideProps } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

type submenu = {
    id: number
    name: string
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
    link: string
}

type data = {
    id: number
    name: string
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
    submenu?: submenu[]
    link?: string
}

export default function CollapsibleMenu({ data, permission }: { data: data, permission?: any }) {
    const [isOpen, setIsOpen] = React.useState(false)

    if (!(data.id) || String(data.id) in permission && (permission ?? null) instanceof Object) {
        return (
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="w-full space-y-2"
            >
                <div className="flex items-center justify-between space-x-4">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between rounded-xl">
                            <div className="flex">
                                {React.createElement(data.icon == null ? CircleAlert : data.icon, {
                                    className: "mr-2 h-4 w-4"
                                })}
                                {data.name ?? "Error"}
                            </div>
                            {isOpen ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )
                            }
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="pl-4 space-y-2">
                    {data?.submenu?.map((item, index) => {
                        if (!(item.id) || String(item.id) in permission[data.id] && (permission[data.id] ?? null) instanceof Object) {
                            return (
                                <a href={item.link} key={index} className="w-full">
                                    <Button variant="ghost" className="w-full justify-start rounded-xl">
                                        {/* Use the appropriate icon dynamically */}
                                        {React.createElement(item.icon == null ? CircleAlert : item.icon, {
                                            className: "mr-2 h-4 w-4"
                                        })}
                                        {item.name ?? "Error"}
                                    </Button>
                                </a>
                            )
                        } else {
                            return null
                        }
                    })}
                </CollapsibleContent>
            </Collapsible>
        )
    } else {
        return null
    }
}