import type { Metadata } from "next";
import { HexEditor } from "@/components/tools/hex-editor";

export const metadata: Metadata = {
    title: "Hex Editor (Viewer) | DevTools",
    description: "Inspect binary files in Hexadecimal and ASCII formats.",
};

export default function HexEditorPage() {
    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Hex Editor
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    View the raw binary content of any file directly in your browser.
                </p>
            </div>
            <HexEditor />
        </div>
    );
}
