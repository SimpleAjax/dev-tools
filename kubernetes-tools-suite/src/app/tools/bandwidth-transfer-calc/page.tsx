import { BandwidthTransferCalc } from "@/components/tools/bandwidth-transfer-calc"

export const metadata = {
    title: 'Bandwidth & Data Transfer Calculator | K8s Tools',
    description: 'Calculate how long it takes to transfer files over network. Convert between bits/bytes and estimate migration times.',
}

export default function BandwidthCalcPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Data Transfer Calculator</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Planning a database migration or cluster backup? Calculate exactly how long your data transfer will take based on available network bandwidth.
                </p>
            </div>

            <BandwidthTransferCalc />
        </div>
    )
}
