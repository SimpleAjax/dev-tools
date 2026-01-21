import { Metadata } from "next";
import { EmvDecoder } from "@/components/tools/emv-decoder";

export const metadata: Metadata = {
    title: "EMV Tag Decoder (TLV) | Fintech Tools",
    description: "Parse and visualize detailed EMV Chip Card data in Tag-Length-Value format.",
    keywords: ["EMV", "TLV Parser", "Chip Card Decoder", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">EMV Tag Decoder</h1>
                <p className="text-lg text-muted-foreground">
                    Decode standard EMV chip data strings (TLV format) into human-readable tags and values.
                </p>
            </div>
            <EmvDecoder />
        </div>
    );
}
