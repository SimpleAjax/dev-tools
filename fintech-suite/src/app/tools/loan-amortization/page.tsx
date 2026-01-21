import { Metadata } from "next";
import { LoanAmortization } from "@/components/tools/loan-amortization";

export const metadata: Metadata = {
    title: "Loan Amortization Calculator | Fintech Tools",
    description: "Generate loan payment schedules. Visualize Principal vs Interest breakdown over time.",
    keywords: ["Loan Calculator", "Amortization Schedule", "Mortgage Check", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Loan Amortization Calculator</h1>
                <p className="text-lg text-muted-foreground">
                    Calculate monthly payments and see how interest decreases over time.
                </p>
            </div>
            <LoanAmortization />
        </div>
    );
}
