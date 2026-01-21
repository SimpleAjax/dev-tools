import { Metadata } from "next";
import { VatRates } from "@/components/tools/vat-rates";

export const metadata: Metadata = {
    title: "VAT & GST Rates Lookup (2025) | Fintech Tools",
    description: "Quick reference for Value Added Tax (VAT) and Goods and Services Tax (GST) rates by country.",
    keywords: ["VAT Generator", "GST Rates", "Tax API", "Global Sales Tax", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">VAT & GST Rates</h1>
                <p className="text-lg text-muted-foreground">
                    Current standard and reduced tax rates for major economies.
                </p>
            </div>
            <VatRates />
        </div>
    );
}
