import { Metadata } from "next";
import { IbanValidator } from "@/components/tools/iban-validator";

export const metadata: Metadata = {
    title: "Global IBAN Validator | Fintech Tools",
    description: "Validate International Bank Account Numbers (IBAN). Check Mod-97 checksums and country-specific structures.",
    keywords: ["IBAN Validator", "Bank Account Checker", "Mod-97", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Global IBAN Validator</h1>
                <p className="text-lg text-muted-foreground">
                    Verify the integrity of International Bank Account Numbers before processing payments.
                </p>
            </div>

            <IbanValidator />

            <div className="mt-12 space-y-6 max-w-3xl text-muted-foreground">
                <h2 className="text-2xl font-semibold text-foreground">Understanding IBAN Validation</h2>
                <p>
                    An IBAN (International Bank Account Number) consists of up to 34 alphanumeric characters.
                    Validation logic relies on the <strong>Mod-97-10</strong> algorithm (ISO 7064).
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Step 1:</strong> Check country code and length.</li>
                    <li><strong>Step 2:</strong> Move the first 4 characters (Country + Check) to the end.</li>
                    <li><strong>Step 3:</strong> Replace letters with numbers (A=10, B=11 ... Z=35).</li>
                    <li><strong>Step 4:</strong> Calculate <code>Integer % 97</code>. If the result is <strong>1</strong>, it is valid.</li>
                </ul>
            </div>
        </div>
    );
}
