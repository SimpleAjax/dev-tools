import { BatchSavings } from "@/components/tools/batch-savings";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "OpenAI Batch API Calculator | AI Stack",
    description: "Calculate your potential 50% savings by moving non-urgent workloads to the OpenAI Batch API.",
};

export default function BatchSavingsPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Batch API Savings</h1>
                <p className="text-muted-foreground mt-2">
                    Visualize the impact of moving high-volume, non-urgent tasks to async batch processing.
                </p>
            </div>

            <BatchSavings />
        </div>
    );
}
