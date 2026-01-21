import { Metadata } from "next";
import { Iso8583Builder } from "@/components/tools/iso-8583-builder";

export const metadata: Metadata = {
    title: "ISO 8583 Message Builder | Fintech Tools",
    description: "Construct valid ISO 8583 messages for testing payment switches. Generates Hex bitmaps automatically.",
    keywords: ["ISO 8583", "Message Builder", "Payments Testing", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">ISO 8583 Message Builder</h1>
                <p className="text-lg text-muted-foreground">
                    Construct standard ISO 8583 messages by toggling fields. Automatically calculates the Bitmap.
                </p>
            </div>
            <Iso8583Builder />
        </div>
    );
}
