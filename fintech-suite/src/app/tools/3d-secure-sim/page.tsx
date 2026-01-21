import { Metadata } from "next";
import { ThreeDSecureSim } from "@/components/tools/3d-secure-sim";

export const metadata: Metadata = {
    title: "3D Secure Flow Simulator | Fintech Tools",
    description: "Interactive visual guide to the 3D Secure (3DS2) authentication flow. Frictionless vs Challenge simulation.",
    keywords: ["3D Secure", "3DS2", "Payment Auth", "Frictionless Flow", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">3D Secure Flow Simulator</h1>
                <p className="text-lg text-muted-foreground">
                    Visualize the step-by-step authentication process between Merchant, Directory Server, and Issuer.
                </p>
            </div>
            <ThreeDSecureSim />
        </div>
    );
}
