import { ToolShell } from "@/components/tool-shell";
import { HashGenerator } from "@/components/tools/hash-generator";
import { tools } from "@/lib/tool-metadata";
import { Hash } from "lucide-react";

export const metadata = {
    title: "Hash Generator (MD5, SHA256) | Security Suite",
    description: "Calculate cryptographic hashes for text or files locally. Supports MD5, SHA-1, SHA-256, and SHA-512.",
};

export default function HashGeneratorPage() {
    const tool = tools.find((t) => t.slug === "hash-generator");

    return (
        <ToolShell
            toolName={tool?.name || "Hash Generator"}
            description={tool?.description || "Generate cryptographic hashes instantly."}
            icon={<Hash className="h-8 w-8" />}
        >
            <HashGenerator />
        </ToolShell>
    );
}
