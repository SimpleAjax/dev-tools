import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const tools = [
  {
    category: "Payment Protocols",
    items: [
      { name: "ISO 8583 Parser", href: "/tools/iso-8583-parser", icon: FileCode, description: "Decompile raw banking message bitmaps into human-readable fields." },
      { name: "ISO 8583 Builder", href: "/tools/iso-8583-builder", icon: Terminal, description: "Form-based builder for testing payment switches." },
      { name: "EMV Tag Decoder", href: "/tools/emv-decoder", icon: CreditCard, description: "Parse Chip card data (TLV) and visualize tags." },
      { name: "ACH File Viewer", href: "/tools/ach-viewer", icon: Database, description: "Visualize fixed-width NACHA banking files." },
    ],
  },
  {
    category: "Validation & Checkers",
    items: [
      { name: "Global IBAN Validator", href: "/tools/iban-validator", icon: Globe, description: "Validate Mod-97 checksums and country structure." },
      { name: "SWIFT/BIC Lookup", href: "/tools/swift-lookup", icon: Search, description: "Validate and identify bank/branch codes." },
      { name: "Sort Code Validator", href: "/tools/sort-code-validator", icon: Activity, description: "UK banking code validation." },
      { name: "Luhn Validator", href: "/tools/luhn-validator", icon: ShieldCheck, description: "Animate credit card checksum validation." },
      { name: "Crypto Address Check", href: "/tools/crypto-address-check", icon: Lock, description: "Validate BTC/ETH/SOL address formats." },
    ],
  },
  {
    category: "Financial Calculators",
    items: [
      { name: "Loan Amortization", href: "/tools/loan-amortization", icon: Calculator, description: "Generate payment schedules and interest breakdowns." },
      { name: "Stripe vs PayPal Fees", href: "/tools/payment-fees", icon: Briefcase, description: "Compare payment processing costs." },
      { name: "XIRR Calculator", href: "/tools/xirr-calc", icon: Activity, description: "Calculate internal rate of return for irregular cash flows." },
      { name: "IEEE 754 Visualizer", href: "/tools/ieee-754-vis", icon: Terminal, description: "Demonstrate floating point arithmetic issues." },
    ],
  },
  {
    category: "Simulations & Mocking",
    items: [
      { name: "Credit Card Mocker", href: "/tools/credit-card-mocker", icon: CreditCard, description: "Generate test numbers for Stripe/integration testing." },
      { name: "3D Secure Simulator", href: "/tools/3d-secure-sim", icon: ShieldCheck, description: "Visualize the Frictionless vs Challenge auth flow." },
      { name: "Idempotency Key Gen", href: "/tools/idempotency-gen", icon: Lock, description: "UUID v7 generator with context on API safety." },
      { name: "Webhook Verifier", href: "/tools/webhook-verifier", icon: Terminal, description: "Debug HMAC-SHA256 signatures." },
      { name: "Sanctions Search", href: "/tools/sanctions-search", icon: Search, description: "Check names against OFAC SDN list." },
    ],
  },
  {
    category: "Compliance",
    items: [
      { name: "PCI-DSS Checklist", href: "/tools/pci-dss-check", icon: ShieldCheck, description: "Interactive compliance audit tool." },
      { name: "VAT/GST Rates", href: "/tools/vat-rates", icon: Globe, description: "Check tax rates for different countries." },
    ],
  },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
          Fintech & Compliance Suite
        </h1>
        <p className="text-muted-foreground text-lg">
          Engineering utilities for payments, banking, and compliance.
        </p>
      </div>

      <div className="space-y-10">
        {tools.map((category) => (
          <section key={category.category} className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-primary">
              {category.category}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.items.map((tool) => (
                <Link key={tool.href} href={tool.href}>
                  <Card className="h-full hover:bg-slate-900/50 transition-colors cursor-pointer border-slate-800">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          <tool.icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                      </div>
                      <CardDescription>
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
