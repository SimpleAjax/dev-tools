import { Metadata } from "next";
import { SwiftLookup } from "@/components/tools/swift-lookup";

export const metadata: Metadata = {
    title: "SWIFT/BIC Code Lookup | Fintech Tools",
    description: "Validate and identify SWIFT/BIC codes. Deconstruct bank, country, location, and branch codes.",
    keywords: ["SWIFT Code", "BIC Lookup", "Bank Identifier", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight">SWIFT / BIC Lookup</h1>
                <p className="text-lg text-muted-foreground">
                    Instantly validate ISO 9362 Business Identifier Codes.
                </p>
            </div>
            <SwiftLookup />
        </div>
    );
}
