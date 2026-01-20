import { ToolShell } from "@/components/tool-shell";
import { HtpasswdGenerator } from "@/components/tools/htpasswd-generator";
import { tools } from "@/lib/tool-metadata";
import { Lock } from "lucide-react";

export const metadata = {
    title: "HTPasswd Generator | Security Suite",
    description: "Securely generate .htpasswd entries for Apache/Nginx basic auth using Bcrypt.",
};

export default function HtpasswdGeneratorPage() {
    const tool = tools.find((t) => t.slug === "htpasswd-generator");

    return (
        <ToolShell
            toolName={tool?.name || "HTPasswd Generator"}
            description={tool?.description || "Create secure basic auth credentials."}
            icon={<Lock className="h-8 w-8" />}
        >
            <HtpasswdGenerator />
        </ToolShell>
    );
}
