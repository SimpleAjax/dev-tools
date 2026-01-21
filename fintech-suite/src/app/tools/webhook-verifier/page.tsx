import { Metadata } from "next";
import { WebhookVerifier } from "@/components/tools/webhook-verifier";

export const metadata: Metadata = {
    title: "Webhook Signature Verifier | Fintech Tools",
    description: "Debug webhook processing by calculating HMAC-SHA256 signatures manually. Verify Stripe, Twilio, and GitHub webhooks.",
    keywords: ["HMAC SHA256", "Webhook Debugger", "Stripe Signature", "API Security", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Webhook Signature Verifier</h1>
                <p className="text-lg text-muted-foreground">
                    Troubleshoot &quot;Invalid Signature&quot; errors by re-computing the HMAC locally.
                </p>
            </div>
            <WebhookVerifier />
        </div>
    );
}
