import { ImageGenCost } from "@/components/tools/image-gen-cost";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Image Generation Cost Calculator | AI Stack",
    description: "Estimate monthly costs for DALL-E 3 and Midjourney based on generation volume.",
};

export default function ImageGenPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Image Gen Cost</h1>
                <p className="text-muted-foreground mt-2">
                    Budget for image generation APIs and subscriptions.
                </p>
            </div>

            <ImageGenCost />
        </div>
    );
}
