"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Command = {
    desc: string;
    cmd: string;
    category: "Basics" | "Undo" | "Branching" | "Remote" | "Log";
};

const COMMANDS: Command[] = [
    { desc: "Initialize a new repository", cmd: "git init", category: "Basics" },
    { desc: "Clone a repository", cmd: "git clone <url>", category: "Basics" },
    { desc: "Stage all changes", cmd: "git add .", category: "Basics" },
    { desc: "Commit changes", cmd: "git commit -m \"message\"", category: "Basics" },
    { desc: "List branches", cmd: "git branch", category: "Branching" },
    { desc: "Create a new branch", cmd: "git branch <name>", category: "Branching" },
    { desc: "Switch to a branch", cmd: "git checkout <name>", category: "Branching" },
    { desc: "Create and switch to new branch", cmd: "git checkout -b <name>", category: "Branching" },
    { desc: "Merge branch into current", cmd: "git merge <branch>", category: "Branching" },
    { desc: "Undo last commit (keep changes)", cmd: "git reset --soft HEAD~1", category: "Undo" },
    { desc: "Undo last commit (discard changes)", cmd: "git reset --hard HEAD~1", category: "Undo" },
    { desc: "Discard changes in file", cmd: "git checkout -- <file>", category: "Undo" },
    { desc: "Show log", cmd: "git log", category: "Log" },
    { desc: "Show status", cmd: "git status", category: "Basics" },
    { desc: "Fetch changes", cmd: "git fetch", category: "Remote" },
    { desc: "Pull changes", cmd: "git pull", category: "Remote" },
    { desc: "Push changes", cmd: "git push", category: "Remote" },
    { desc: "Stash changes", cmd: "git stash", category: "Basics" },
    { desc: "Pop stashed changes", cmd: "git stash pop", category: "Basics" },
    { desc: "Pick a commit from another branch (Cherry pick)", cmd: "git cherry-pick <commit-hash>", category: "Branching" },
    { desc: "Show commit history graph", cmd: "git log --graph --oneline --all", category: "Log" },
    { desc: "Rename a branch", cmd: "git branch -m <new-name>", category: "Branching" },
    { desc: "Delete a branch", cmd: "git branch -d <name>", category: "Branching" },
    { desc: "Force delete a branch", cmd: "git branch -D <name>", category: "Branching" },
    { desc: "Amend last commit message", cmd: "git commit --amend", category: "Basics" },
];

export function GitCheatsheet() {
    const [search, setSearch] = useState("");

    const filtered = COMMANDS.filter(c =>
        c.desc.toLowerCase().includes(search.toLowerCase()) ||
        c.cmd.toLowerCase().includes(search.toLowerCase())
    );

    const categories = Array.from(new Set(filtered.map(c => c.category)));

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                    className="pl-9 h-10 text-lg"
                    placeholder="I want to..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                />
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pr-2">
                {categories.map(cat => (
                    <div key={cat} className="space-y-3">
                        <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-sm sticky top-0 bg-zinc-50 dark:bg-black py-2 z-10">
                            {cat}
                        </h3>
                        <div className="flex flex-col border rounded-md divide-y dark:divide-slate-800 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            {filtered.filter(c => c.category === cat).map((cmd, i) => (
                                <div
                                    key={i}
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                                    onClick={() => navigator.clipboard.writeText(cmd.cmd)}
                                >
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {cmd.desc}
                                    </span>
                                    <code className="bg-slate-100 dark:bg-black px-2 py-1 rounded font-mono text-sm text-blue-600 dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                        $ {cmd.cmd}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No commands found matching "{search}"
                    </div>
                )}
            </div>
        </div>
    );
}
