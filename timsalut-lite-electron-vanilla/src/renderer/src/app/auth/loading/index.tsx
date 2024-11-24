import AuthLayout from "../layout";
import { Progress } from "@/components/ui/progress";


export default function AuthLoading() {
    return (
        <AuthLayout>
            <h1 className="text-4xl font-semibold mb-4">Loading</h1>
            <div className="max-w-96">
                <Progress value={33} className="w-96 border dark:border-neutral-500" />
            </div>
            <h4 className="max-w-96 w-full">fetching user data...</h4>
        </AuthLayout>
    )
}