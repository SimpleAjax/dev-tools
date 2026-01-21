import { Metadata } from "next";
import { CryptoAddressCheck } from "@/components/tools/crypto-address-check";

export const metadata: Metadata = {
    title: "Crypto Wallet Address Validator | Fintech Tools",
    description: "Validate Bitcoin, Ethereum, and Solana wallet address formats using regex pattern matching.",
    keywords: ["Crypto Validator", "Wallet Check", "BTC", "ETH", "SOL", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6 flex items-center justify-center min-h-[50vh]">
            <div className="w-full">
                <div className="space-y-2 text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Crypto Address Check</h1>
                    <p className="text-lg text-muted-foreground">
                        Verify wallet address formats for major blockchains before sending funds.
                    </p>
                </div>
                <CryptoAddressCheck />
            </div>
        </div>
    );
}
