import { ToolShell } from "@/components/tool-shell";
import { CurlToCode } from "@/components/tools/curl-to-code";
import { tools } from "@/lib/tool-metadata";
import { Terminal } from "lucide-react";

export const metadata = {
    title: "Curl to Code Converter | Security Suite",
    description: "Convert Curl commands to Python (Requests), Node.js (Axios), Go, and Rust code.",
};

export default function CurlToCodePage() {
    const tool = tools.find((t) => t.slug === "curl-to-code");

    return (
        <ToolShell
            toolName={tool?.name || "Curl to Code"}
            description={tool?.description || "Generate API client code from Curl."}
            icon={<Terminal className="h-8 w-8" />}
        >
            <CurlToCode />
        </ToolShell>
    );
}
