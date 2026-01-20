import { BandwidthCalc } from "@/components/tools/bandwidth-calc";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Model Download Time Calculator | AI Stack",
    description: "How long will it take to download Llama 3 70B? Estimate bandwidth requirements.",
};

export default function BandwidthPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Model Download Calculator</h1>
                <p className="text-muted-foreground mt-2">
                    Estimate download times for large model weights based on your internet connection.
                </p>
            </div>

            <BandwidthCalc />
        </div>
    );
}
