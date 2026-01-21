import { ModelLeaderboard } from "@/components/tools/model-leaderboard";

export default function ModelLeaderboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Model Leaderboard</h1>
                <p className="text-muted-foreground">
                    Current rankings of top LLMs based on aggregated ELO scores and community benchmarks.
                </p>
            </div>
            <ModelLeaderboard />
        </div>
    );
}
