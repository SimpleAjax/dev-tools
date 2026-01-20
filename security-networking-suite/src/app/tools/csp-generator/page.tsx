import { ToolShell } from "@/components/tool-shell";
import { CspGenerator } from "@/components/tools/csp-generator";
import { tools } from "@/lib/tool-metadata";
import { Shield } from "lucide-react";

export const metadata = {
    title: "CSP Generator | Security Suite",
    description: "Generate robust Content Security Policy (CSP) headers to prevent XSS attacks.",
};

export default function CspGeneratorPage() {
    const tool = tools.find((t) => t.slug === "csp-generator");

    return (
        <ToolShell
            toolName={tool?.name || "CSP Generator"}
            description={tool?.description || "Build a Content Security Policy visually."}
            icon={<Shield className="h-8 w-8" />}
        >
            <CspGenerator />
        </ToolShell>
    );
}
