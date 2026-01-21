import { Metadata } from "next";
import { CreditCardMocker } from "@/components/tools/credit-card-mocker";

export const metadata: Metadata = {
    title: "Credit Card Generator / Mocker | Fintech Tools",
    description: "Generate valid test credit card numbers for Visa, Mastercard, and Amex. Useful for staging/integration testing.",
    keywords: ["Credit Card Generator", "Stripe Test Cards", "Payment Mocker", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Credit Card Mocker</h1>
                <p className="text-lg text-muted-foreground">
                    Generate mathematically valid (Luhn) test card numbers for integration testing.
                </p>
            </div>
            <CreditCardMocker />
        </div>
    );
}
