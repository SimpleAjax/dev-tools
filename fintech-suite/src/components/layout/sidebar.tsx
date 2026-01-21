"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    CreditCard,
    FileCode,
    Calculator,
    ShieldCheck,
    Search,
    Activity,
    Terminal,
    Globe,
    Lock,
    Database,
    Briefcase
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const tools = [
    {
        category: "Payment Protocols",
        items: [
            { name: "ISO 8583 Parser", href: "/tools/iso-8583-parser", icon: FileCode },
            { name: "ISO 8583 Builder", href: "/tools/iso-8583-builder", icon: Terminal },
            { name: "EMV Tag Decoder", href: "/tools/emv-decoder", icon: CreditCard },
            { name: "ACH File Viewer", href: "/tools/ach-viewer", icon: Database },
        ],
    },
    {
        category: "Validation & Checkers",
        items: [
            { name: "Global IBAN Validator", href: "/tools/iban-validator", icon: Globe },
            { name: "SWIFT/BIC Lookup", href: "/tools/swift-lookup", icon: Search },
            { name: "Sort Code Validator", href: "/tools/sort-code-validator", icon: Activity },
            { name: "Luhn Validator", href: "/tools/luhn-validator", icon: ShieldCheck },
            { name: "Crypto Address Check", href: "/tools/crypto-address-check", icon: Lock },
        ],
    },
    {
        category: "Financial Calculators",
        items: [
            { name: "Loan Amortization", href: "/tools/loan-amortization", icon: Calculator },
            { name: "Stripe vs PayPal Fees", href: "/tools/payment-fees", icon: Briefcase },
            { name: "XIRR Calculator", href: "/tools/xirr-calc", icon: Activity },
            { name: "IEEE 754 Visualizer", href: "/tools/ieee-754-vis", icon: Terminal },
        ],
    },
    {
        category: "Simulations & Mocking",
        items: [
            { name: "Credit Card Mocker", href: "/tools/credit-card-mocker", icon: CreditCard },
            { name: "3D Secure Simulator", href: "/tools/3d-secure-sim", icon: ShieldCheck },
            { name: "Idempotency Key Gen", href: "/tools/idempotency-gen", icon: Lock },
            { name: "Webhook Verifier", href: "/tools/webhook-verifier", icon: Terminal },
            { name: "Sanctions Search", href: "/tools/sanctions-search", icon: Search },
        ],
    },
    {
        category: "Compliance",
        items: [
            { name: "PCI-DSS Checklist", href: "/tools/pci-dss-check", icon: ShieldCheck },
            { name: "VAT/GST Rates", href: "/tools/vat-rates", icon: Globe },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-slate-950/50 backdrop-blur lg:block w-72 h-screen sticky top-0">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                    <ShieldCheck className="h-6 w-6" />
                    <span>Fintech Suite</span>
                </Link>
            </div>
            <ScrollArea className="h-[calc(100vh-3.5rem)]">
                <div className="flex flex-col gap-6 p-6">
                    {tools.map((category) => (
                        <div key={category.category}>
                            <h4 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                {category.category}
                            </h4>
                            <div className="flex flex-col gap-1">
                                {category.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
