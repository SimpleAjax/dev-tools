import { DiffChecker } from "@/components/tools/diff-checker";

export const metadata = {
    title: "Diff Checker | DevTools",
    description: "Compare two text files or snippets side-by-side to find differences.",
};

export default function DiffCheckerPage() {
    return <DiffChecker />;
}
