import { ToolShell } from "@/components/tool-shell";
import { PasswordEntropy } from "@/components/tools/password-entropy";
import { tools } from "@/lib/tool-metadata";
import { Key } from "lucide-react";

export const metadata = {
    title: "Password Entropy Calculator | Security Suite",
    description: "Calculate password bits of entropy and estimated time to crack. Visualize password strength.",
};

export default function PasswordEntropyPage() {
    const tool = tools.find((t) => t.slug === "password-entropy");

    return (
        <ToolShell
            toolName={tool?.name || "Password Entropy"}
            description={tool?.description || "Analyze password strength accurately."}
            icon={<Key className="h-8 w-8" />}
        >
            <PasswordEntropy />
        </ToolShell>
    );
}
