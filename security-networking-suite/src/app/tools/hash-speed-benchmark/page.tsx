"use client";

import { ToolShell } from "@/components/tool-shell";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Zap, Server, Timer } from "lucide-react";
import { createMD5, createSHA256, createSHA1, createSHA512 } from "hash-wasm";

interface AlgorithmResult {
    name: string;
    hashesPerSecond: number;
    timeMs: number;
    category: "Fast" | "Medium" | "Slow (KDF)";
}

export default function HashBenchmark() {
    const [running, setRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<AlgorithmResult[]>([]);

    const runBenchmark = async () => {
        setRunning(true);
        setResults([]);
        setProgress(0);

        try {
            // 1. MD5
            setProgress(10);
            const md5 = await createMD5();
            const startMD5 = performance.now();
            const iterationsMD5 = 50000;
            for (let i = 0; i < iterationsMD5; i++) {
                md5.init();
                md5.update("test-string-" + i);
                md5.digest();
            }
            const endMD5 = performance.now();
            const timeMD5 = endMD5 - startMD5;
            setResults(prev => [...prev, {
                name: "MD5",
                hashesPerSecond: (iterationsMD5 / timeMD5) * 1000,
                timeMs: timeMD5 / iterationsMD5,
                category: "Fast"
            }]);

            // 2. SHA-256
            setProgress(40);
            const sha256 = await createSHA256();
            const startSHA = performance.now();
            const iterationsSHA = 20000;
            for (let i = 0; i < iterationsSHA; i++) {
                sha256.init();
                sha256.update("test-string-" + i);
                sha256.digest();
            }
            const endSHA = performance.now();
            const timeSHA = endSHA - startSHA;
            setResults(prev => [...prev, {
                name: "SHA-256",
                hashesPerSecond: (iterationsSHA / timeSHA) * 1000,
                timeMs: timeSHA / iterationsSHA,
                category: "Fast"
            }]);

            // 3. SHA-1
            setProgress(70);
            const sha1 = await createSHA1();
            const startSHA1 = performance.now();
            const iterationsSHA1 = 40000;
            for (let i = 0; i < iterationsSHA1; i++) {
                sha1.init();
                sha1.update("test-string-" + i);
                sha1.digest();
            }
            const endSHA1 = performance.now();
            const timeSHA1 = endSHA1 - startSHA1;
            setResults(prev => [...prev, {
                name: "SHA-1",
                hashesPerSecond: (iterationsSHA1 / timeSHA1) * 1000,
                timeMs: timeSHA1 / iterationsSHA1,
                category: "Fast"
            }]);

            // 4. SHA-512
            setProgress(90);
            const sha512 = await createSHA512();
            const startSHA512 = performance.now();
            const iterationsSHA512 = 15000;
            for (let i = 0; i < iterationsSHA512; i++) {
                sha512.init();
                sha512.update("test-string-" + i);
                sha512.digest();
            }
            const endSHA512 = performance.now();
            const timeSHA512 = endSHA512 - startSHA512;
            setResults(prev => [...prev, {
                name: "SHA-512",
                hashesPerSecond: (iterationsSHA512 / timeSHA512) * 1000,
                timeMs: timeSHA512 / iterationsSHA512,
                category: "Fast"
            }]);

            setProgress(100);
        } catch (e) {
            console.error(e);
        } finally {
            setRunning(false);
        }
    };

    return (
        <ToolShell toolName="Hash Speed Benchmark" description="Compare the speed of various hashing algorithms (MD5, SHA-1, SHA-256, SHA-512) in your browser." icon={<Activity className="h-6 w-6" />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 p-6 space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Timer className="h-5 w-5" />
                            Benchmark
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Run a performance test to see how many hashes your browser can calculate per second using WebAssembly.
                        </p>
                    </div>

                    <Button onClick={runBenchmark} disabled={running} className="w-full" size="lg">
                        {running ? "Running..." : "Start Benchmark"}
                    </Button>

                    {running && <Progress value={progress} className="w-full" />}
                </Card>

                <div className="md:col-span-2 space-y-4">
                    {results.map((res, i) => (
                        <Card key={i} className="p-4 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{res.name}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${res.category.includes("Slow") ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                                        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                        }`}>
                                        {res.category}
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    Avg Time: {res.timeMs.toFixed(4)} ms / hash
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-mono font-bold">
                                    {Math.round(res.hashesPerSecond).toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground uppercase">Hashes / Sec</div>
                            </div>
                        </Card>
                    ))}

                    {!running && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                            <Zap className="h-12 w-12 mb-2" />
                            <p>Ready to benchmark</p>
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
