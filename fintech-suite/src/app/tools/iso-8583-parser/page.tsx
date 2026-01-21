import { Metadata } from "next";
import { Iso8583Parser } from "@/components/tools/iso-8583-parser";

export const metadata: Metadata = {
    title: "ISO 8583 Message Parser | Fintech Tools",
    description: "Visualize and decode ISO 8583 payment message bitmaps and fields. Supports 1987 and 1993 variations.",
    keywords: ["ISO 8583", "Payment Switch", "Bitmap Decoder", "Fintech Utils", "Banking Protocol"],
};

export default function Page() {
    return (
        <div className="space-y-6 h-[calc(100vh-8rem)]">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">ISO 8583 Parser</h1>
                <p className="text-lg text-muted-foreground">
                    Deconstruct raw banking messages into human-readable fields.
                    Visualize the primary and secondary bitmaps to debug integration issues with payment gateways.
                </p>
            </div>

            <Iso8583Parser />

            <div className="mt-12 space-y-6 max-w-3xl text-muted-foreground">
                <h2 className="text-2xl font-semibold text-foreground">How ISO 8583 Works</h2>
                <p>
                    ISO 8583 is the international standard for financial transaction card originated interchange messaging.
                    It defines a message format and a communication flow so that different systems can exchange transaction requests and responses.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-4">
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">MTI</h3>
                        <p className="text-sm">Message Type Indicator. Describes the message class (e.g., Authorization, Reversal) and function (Request, Response).</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">Bitmap</h3>
                        <p className="text-sm">A map of 64 or 128 bits that indicates which data elements are present in the message body.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">Data Elements</h3>
                        <p className="text-sm">The actual transaction data (Card Number, Amount, Date) corresponding to the bits set in the Bitmap.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
