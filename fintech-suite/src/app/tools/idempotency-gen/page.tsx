import { Metadata } from "next";
import { IdempotencyGen } from "@/components/tools/idempotency-gen";

export const metadata: Metadata = {
    title: "Idempotency Key Generator | Fintech Tools",
    description: "Generate UUID keys for safe API retries. Learn how to implement idempotency in payment systems.",
    keywords: ["Idempotency-Key", "API Safety", "Double Charge Prevention", "UUID Generator", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Idempotency Key Generator</h1>
                <p className="text-lg text-muted-foreground">
                    Generate unique keys to prevent double-charging users during network failures.
                </p>
            </div>
            <IdempotencyGen />
        </div>
    );
}
