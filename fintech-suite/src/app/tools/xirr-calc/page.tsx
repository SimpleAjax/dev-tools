import { Metadata } from "next";
import { XirrCalc } from "@/components/tools/xirr-calc";

export const metadata: Metadata = {
    title: "XIRR Calculator | Fintech Tools",
    description: "Calculate Internal Rate of Return (XIRR) for irregular cash flows. Useful for investment portfolio performance.",
    keywords: ["XIRR", "IRR Calculator", "Investment Return", "CAGR", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">XIRR Calculator</h1>
                <p className="text-lg text-muted-foreground">
                    Calculate the annualized return on investments with irregular dates.
                </p>
            </div>
            <XirrCalc />
        </div>
    );
}
