import { AudioCost } from "@/components/tools/audio-cost";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Audio Transcription Cost | AI Stack",
    description: "Calculate costs for transcribing audio using OpenAI Whisper API.",
};

export default function AudioPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Audio Transcription Cost</h1>
                <p className="text-muted-foreground mt-2">
                    Estimate the cost of converting speech to text via API.
                </p>
            </div>

            <AudioCost />
        </div>
    );
}
