import { ToolShell } from "@/components/tool-shell";
import { HeaderAnalyzer } from "@/components/tools/security-headers";
import { tools } from "@/lib/tool-metadata";
import { Shield } from "lucide-react";

export const metadata = {
    title: "HTTP Header Analyzer | Security Suite",
    description: "Analyze HTTP response headers for security vulnerabilities (HSTS, CSP, X-Frame-Options).",
};

export default function SecurityHeadersPage() {
    const tool = tools.find((t) => t.slug === "security-headers");

    return (
        <ToolShell
            toolName={tool?.name || "Header Analyzer"}
            description={tool?.description || "Check your site for missing security headers."}
            icon={<Shield className="h-8 w-8" />}
        >
            <HeaderAnalyzer />
        </ToolShell>
    );
}
