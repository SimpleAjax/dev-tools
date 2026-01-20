"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const PRECISIONS = {
    "fp32": { bytes: 4, name: "FP32 (Full Precision)" },
    "fp16": { bytes: 2, name: "FP16 (Half Precision)" },
    "int8": { bytes: 1, name: "INT8 (8-bit)" },
    "int4": { bytes: 0.5, name: "INT4 (4-bit / Q4_K_M)" },
    "bq": { bytes: 0.65, name: "GPTQ/AWQ (Mixed)" }, // Approx
};

const MODEL_PRESETS = {
    "llama-3-8b": { name: "Llama 3 8B", params: 8, layers: 32, hidden: 4096 },
    "llama-3-70b": { name: "Llama 3 70B", params: 70, layers: 80, hidden: 8192 },
    "mistral-7b": { name: "Mistral 7B", params: 7, layers: 32, hidden: 4096 },
    "mixtral-8x7b": { name: "Mixtral 8x7B", params: 47, layers: 32, hidden: 4096 }, // Sparse params
    "grok-1": { name: "Grok-1", params: 314, layers: 64, hidden: 6144 },
    "custom": { name: "Custom", params: 0, layers: 0, hidden: 0 },
};

const GPUS = [
    { name: "NVIDIA RTX 4090", vram: 24 },
    { name: "NVIDIA RTX 3090", vram: 24 },
    { name: "NVIDIA A100 (40GB)", vram: 40 },
    { name: "NVIDIA A100 (80GB)", vram: 80 },
    { name: "NVIDIA H100", vram: 80 },
    { name: "Apple M3 Max", vram: 128 },
    { name: "Apple M2 Ultra", vram: 192 },
    { name: "Consumer Rig (2x 3090)", vram: 48 },
    { name: "Consumer Rig (2x 4060 Ti)", vram: 32 },
];

export function VramEstimator() {
    const [modelPreset, setModelPreset] = useState("llama-3-8b");
    const [params, setParams] = useState(8);
    const [precision, setPrecision] = useState("fp16");
    const [context, setContext] = useState(8192);
    const [batchSize, setBatchSize] = useState(1);

    // Custom params fallback
    const currentModel = MODEL_PRESETS[modelPreset as keyof typeof MODEL_PRESETS];

    // Update params if preset changes
    const handlePresetChange = (val: string) => {
        setModelPreset(val);
        if (val !== "custom") {
            const p = MODEL_PRESETS[val as keyof typeof MODEL_PRESETS];
            setParams(p.params);
        }
    };

    const results = useMemo(() => {
        const bytesPerParam = PRECISIONS[precision as keyof typeof PRECISIONS].bytes;

        // 1. Model Weights
        const weightSizeGB = params * bytesPerParam;

        // 2. KV Cache (Context)
        // Formula: 2 * layers * hidden * context * batch * bytes_per_element
        // KV cache is usually computed in fp16 even if weights are int4, unless utilizing KV cache quantization (advanced)
        // We'll assume KV cache is fp16 (2 bytes) for safety.
        const layers = currentModel.layers || 32; // Fallback
        const hidden = currentModel.hidden || 4096; // Fallback
        const kvCacheBytes = 2 * layers * hidden * context * batchSize * 2; // *2 for fp16
        const kvCacheGB = kvCacheBytes / 1e9;

        // 3. Activation Overhead (Approximation)
        // Usually proportional to batch_size * context * hidden
        const activationOverheadGB = (batchSize * context * hidden * 2) / 1e9 * 0.5; // Rough estimate factor

        // Total
        // Add cuda kernels overhead (~1-2GB usually reserved by torch/cuda context)
        const cudaOverheadGB = 0.5;

        const totalGB = weightSizeGB + kvCacheGB + activationOverheadGB + cudaOverheadGB;

        return {
            weightSizeGB,
            kvCacheGB,
            activationOverheadGB,
            cudaOverheadGB,
            totalGB
        };
    }, [params, precision, context, batchSize, currentModel]);

    return (
        <div className="grid gap-6 lg:grid-cols-12 h-full">
            {/* Controls */}
            <div className="lg:col-span-5 flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Model Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Model Preset</Label>
                            <Select value={modelPreset} onValueChange={handlePresetChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(MODEL_PRESETS).map(([k, v]) => (
                                        <SelectItem key={k} value={k}>{v.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Parameters (Billion)</Label>
                                <Input
                                    type="number"
                                    value={params}
                                    onChange={(e) => setParams(Number(e.target.value))}
                                    disabled={modelPreset !== "custom"}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Quantization</Label>
                                <Select value={precision} onValueChange={setPrecision}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(PRECISIONS).map(([k, v]) => (
                                            <SelectItem key={k} value={k}>{v.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Inference Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Context Window (Tokens)</Label>
                                <span className="text-sm text-muted-foreground">{context.toLocaleString()}</span>
                            </div>
                            <Slider
                                value={[context]}
                                onValueChange={([v]) => setContext(v)}
                                max={128000}
                                step={1024}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Batch Size</Label>
                                <span className="text-sm text-muted-foreground">{batchSize}</span>
                            </div>
                            <Slider
                                value={[batchSize]}
                                onValueChange={([v]) => setBatchSize(v)}
                                max={64}
                                step={1}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Visualization */}
            <div className="lg:col-span-7 flex flex-col gap-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle>Total VRAM Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-5xl font-bold text-primary">{results.totalGB.toFixed(1)}</span>
                            <span className="text-xl font-medium text-muted-foreground mb-1">GB</span>
                        </div>

                        {/* Breakdown */}
                        <div className="grid grid-cols-2 gap-4 my-6 text-sm">
                            <div className="flex justify-between border-b pb-1">
                                <span className="text-muted-foreground">Model Weights</span>
                                <span className="font-mono">{results.weightSizeGB.toFixed(2)} GB</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                                <span className="text-muted-foreground">KV Cache (Context)</span>
                                <span className="font-mono">{results.kvCacheGB.toFixed(2)} GB</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                                <span className="text-muted-foreground">Activation + CUDA</span>
                                <span className="font-mono">{(results.activationOverheadGB + results.cudaOverheadGB).toFixed(2)} GB</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 overflow-auto">
                    <CardHeader>
                        <CardTitle>GPU Compatibility</CardTitle>
                        <CardDescription>Can you run it?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {GPUS.map((gpu) => {
                            const usage = (results.totalGB / gpu.vram) * 100;
                            const fits = results.totalGB <= gpu.vram;

                            return (
                                <div key={gpu.name} className="space-y-1">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>{gpu.name} <span className="text-muted-foreground">({gpu.vram} GB)</span></span>
                                        {fits ? (
                                            <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Fit ({usage.toFixed(0)}%)</span>
                                        ) : (
                                            <span className="text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Overflow</span>
                                        )}
                                    </div>
                                    <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${fits ? 'bg-green-500' : 'bg-red-500'}`}
                                            style={{ width: `${Math.min(usage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
