import { ToolShell } from "@/components/tool-shell";
import { SslCsrGenerator } from "@/components/tools/ssl-csr-generator";
import { tools } from "@/lib/tool-metadata";
import { Lock } from "lucide-react";

export const metadata = {
    title: "SSL CSR Generator | Security Suite",
    description: "Generate OpenSSL Certificate Signing Request (CSR) commands instantly. Secure client-side builder.",
};

export default function SslCsrGeneratorPage() {
    const tool = tools.find((t) => t.slug === "ssl-csr-generator");

    return (
        <ToolShell
            toolName={tool?.name || "SSL CSR Generator"}
            description={tool?.description || "Generate CSR commands for your SSL certificates."}
            icon={<Lock className="h-8 w-8" />}
        >
            <SslCsrGenerator />
        </ToolShell>
    );
}
