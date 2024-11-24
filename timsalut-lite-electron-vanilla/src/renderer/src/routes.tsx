import { createBrowserRouter } from "react-router-dom"
import DashboardBeranda from '@/app/dashboard/beranda'
import DashboardPolisiPendaftaran from '@/app/dashboard/polisi/pendaftaran'
import AuthLogin from '@/app/auth/login'
import AuthLoading from "./app/auth/loading"
import DashboardESamsat from '@/app/dashboard/esamsat'
import DashboardCetakNotice from "./app/dashboard/noticePajak"

export const router = createBrowserRouter([
    {
        path: "auth",
        children: [
            {
                path: "login",
                element: <AuthLogin />,
            },
            {
                path: "loading",
                element: <AuthLoading />,
            }
        ]
    },
    {
        path: "/",
        element: <DashboardBeranda />,
    },
    {
        path: "/polisi",
        children: [
            {
                path: "pendaftaran",
                element: <DashboardPolisiPendaftaran />,
            },
            {
                path: "pendaftaran",
                element: <DashboardPolisiPendaftaran />,
            },
        ]
    },
    {
        path: "/esamsat",
        element: <DashboardESamsat />,
    },
    {
        path: "/notice",
        element: <DashboardCetakNotice />,
    }
])
