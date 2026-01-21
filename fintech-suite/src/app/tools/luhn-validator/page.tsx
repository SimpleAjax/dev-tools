import { Metadata } from "next";
import { LuhnValidator } from "@/components/tools/luhn-validator";

export const metadata: Metadata = {
    title: "Luhn Algorithm Visualizer | Fintech Tools",
    description: "Interactive visualization of the Luhn Algorithm (Mod 10) used for credit card validation.",
    keywords: ["Luhn Algorithm", "Credit Card Checksum", "Mod 10", "Validation"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Luhn Algorithm Visualizer</h1>
                <p className="text-lg text-muted-foreground">
                    Understand how credit card numbers are validated mathematically.
                </p>
            </div>
            <LuhnValidator />
        </div>
    );
}
