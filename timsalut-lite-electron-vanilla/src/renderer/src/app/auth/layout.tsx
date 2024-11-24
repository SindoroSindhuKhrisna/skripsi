export default function AuthLayout({
    children,
}: Readonly<{
    children?: React.ReactNode;
}>): JSX.Element {
    return (
        <div className="grid grid-cols-2 h-dvh w-dvw">
            <div className="flex flex-col items-center justify-center bg-neutral-500 dark:bg-black">
                <h1 className="flex flex-row text-6xl items-center pb-4 border-b-2 font-bold">
                    Timsalut&nbsp;
                    <p className="font-light">Lite</p>
                    {/* <LoraConnectionIndicator /> */}
                </h1>
            </div>
            <div className="flex flex-col items-center justify-center bg-neutral-200 dark:bg-neutral-800">
                {children}
            </div>
        </div >
    )
}