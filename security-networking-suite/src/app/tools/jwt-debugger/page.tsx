import { ToolShell } from "@/components/tool-shell";
import { JwtDebugger } from "@/components/tools/jwt-debugger";
import { tools } from "@/lib/tool-metadata";
import { Shield } from "lucide-react";

export const metadata = {
    title: "JWT Debugger | Security Suite",
    description: "Decode and inspect JSON Web Tokens (JWT) client-side. Visualize headers, payloads, and signatures without sending keys to a server.",
};

export default function JwtDebuggerPage() {
    const tool = tools.find((t) => t.slug === "jwt-debugger");

    return (
        <ToolShell
            toolName={tool?.name || "JWT Debugger"}
            description={tool?.description || "Decode JWTs instantly."}
            icon={<Shield className="h-8 w-8" />}
        >
            <JwtDebugger />
        </ToolShell>
    );
}
