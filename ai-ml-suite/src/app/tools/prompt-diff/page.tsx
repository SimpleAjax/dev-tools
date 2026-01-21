import { PromptDiff } from "@/components/tools/prompt-diff";

export default function PromptDiffPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Prompt Diff Tool</h1>
                <p className="text-muted-foreground">
                    Compare two prompts side-by-side to visualize changes, additions, and deletions.
                </p>
            </div>
            <PromptDiff />
        </div>
    );
}
