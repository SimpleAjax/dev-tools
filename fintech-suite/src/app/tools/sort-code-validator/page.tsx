import { Metadata } from "next";
import { SortCodeValidator } from "@/components/tools/sort-code-validator";

export const metadata: Metadata = {
    title: "UK Banking Sort Code Validator | Fintech Tools",
    description: "Validate UK Account Numbers against Sort Codes using standard modulus checking rules.",
    keywords: ["UK Banking", "Sort Code", "Modulus Checking", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex items-center justify-center">
            <div className="w-full">
                <div className="space-y-2 text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Sort Code Validator</h1>
                    <p className="text-lg text-muted-foreground">
                        Check if a UK Account Number is valid for a specific branch (Sort Code).
                    </p>
                </div>
                <SortCodeValidator />
            </div>
        </div>
    );
}
