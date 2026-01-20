import { ToolShell } from "@/components/tool-shell";
import { SpfDkimGenerator } from "@/components/tools/spf-dkim-generator";
import { tools } from "@/lib/tool-metadata";
import { Globe } from "lucide-react";

export const metadata = {
    title: "SPF & DMARC Generator | Security Suite",
    description: "Generate DNS records for email security and deliverability (SPF, DMARC).",
};

export default function SpfDkimGeneratorPage() {
    const tool = tools.find((t) => t.slug === "spf-dkim-generator");

    return (
        <ToolShell
            toolName={tool?.name || "SPF/DMARC Generator"}
            description={tool?.description || "Secure your email domain."}
            icon={<Globe className="h-8 w-8" />}
        >
            <SpfDkimGenerator />
        </ToolShell>
    );
}
