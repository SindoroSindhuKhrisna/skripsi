"use client"
import React from "react"
import authData from "@/app/auth/dummyAuthData.json"
import sidebarMenu from "./sidebar-menu"
import CollapsibleMenu from "@/components/dashboard/sidebar/collapsible-menu"
import { Button } from "@/components/ui/button"
import {
    CircleAlert,
    LucideProps
} from "lucide-react"

type Submenu = {
    id: number
    name: string
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
    link: string
}

type Menu = {
    id: number
    name: string
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
    link?: string
    submenu?: Submenu[]
}

type MenuItem = {
    id?: number
    name: string
    icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
    link?: string
    menu?: Menu[]
}

type Permission = {
    [key: string]: any
}

export default function Sidebar() {
    return (
        <div className="flex flex-col size-full text-black dark:text-white items-center border-r-2 /bg-neutral-100 /dark:bg-neutral-900 border-zinc-900 dark:border-gray-500 pt-4">
            <div className="w-full border-b-2 text-center pb-4 px-2 border-gray-900 dark:border-gray-500">
                <p className="text-2xl">
                    {authData.uptd}
                </p>
                <p className="text-xl font-extralight">
                    {authData.tilay}
                </p>
                <p className="text-blue-500" id="">Non-Tunai</p>
                <p className="text-green-500" id="">Buka</p>
            </div>

            {/* MENUS */}
            <div className="size-full overflow-y-auto px-2">
                {sidebarMenu().map((item: MenuItem) => {
                    if (!item.id || (item.id.toString() in authData.permission && typeof authData.permission === 'object')) {
                        if (item.menu) {
                            return (
                                <div className="w-full my-4" key={item.name}>
                                    <h2 className="mb-2 px-4 w-full text-left text-lg font-semibold tracking-tight">
                                        {item.name}
                                    </h2>
                                    <div className="space-y-1">
                                        {item.menu.map((menu: Menu) => {
                                            if (menu.submenu) {
                                                return <CollapsibleMenu
                                                    data={menu}
                                                    key={menu.name}
                                                    permission={item.id ? (authData.permission as Permission)[item.id.toString()] : undefined}
                                                />;
                                            }
                                            return (
                                                <a href={menu.link} key={menu.name} className="w-full">
                                                    <Button variant={window.location.pathname == menu.link ? "secondary" : "ghost"} className="w-full justify-start rounded-xl">
                                                        {React.createElement(menu.icon || CircleAlert, {
                                                            className: "mr-2 h-4 w-4"
                                                        })}
                                                        {menu.name}
                                                    </Button>
                                                </a>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <div className="w-full mt-4" key={item.name}>
                                    <div className="space-y-1">
                                        <a href={item.link ?? ""} key={item.name} className="w-full">
                                            <Button variant={window.location.pathname == item.link ? "secondary" : "ghost"} className="w-full justify-start rounded-xl">
                                                {React.createElement(item.icon || CircleAlert, {
                                                    className: "mr-2 h-4 w-4"
                                                })}
                                                {item.name}
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            )
                        }
                    } else {
                        return null
                    }
                })}
            </div>
        </div>
    )
}