import { Metadata } from "next";
import { PaymentFees } from "@/components/tools/payment-fees";

export const metadata: Metadata = {
    title: "Stripe vs PayPal Fee Calculator | Fintech Tools",
    description: "Compare payment processing fees for Stripe, PayPal, Square, and ACH. Find the cheapest gateway.",
    keywords: ["Stripe Fees", "PayPal Fees", "Payment Calculator", "Merchant Costs", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Payment Gateway Fee Comparison</h1>
                <p className="text-lg text-muted-foreground">
                    See how much you actually keep after processing fees.
                </p>
            </div>
            <PaymentFees />
        </div>
    );
}
