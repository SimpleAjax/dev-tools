export interface GPUInstance {
    provider: "AWS" | "Azure" | "GCP" | "Lambda";
    name: string;
    gpu: string;
    vramPerGPU: number; // GB
    gpuCount: number;
    totalVRAM: number;
    priceHourly: number;
    pricePerGBVRAM: number;
    notes?: string;
}

// Manually curated list of popular AI training/inference instances
// Prices are On-Demand US-East estimates
export const GPU_DATA: GPUInstance[] = [
    // AWS
    { provider: "AWS", name: "g4dn.xlarge", gpu: "T4", vramPerGPU: 16, gpuCount: 1, totalVRAM: 16, priceHourly: 0.526, pricePerGBVRAM: 0.033 },
    { provider: "AWS", name: "g5.xlarge", gpu: "A10G", vramPerGPU: 24, gpuCount: 1, totalVRAM: 24, priceHourly: 1.006, pricePerGBVRAM: 0.042 },
    { provider: "AWS", name: "p3.2xlarge", gpu: "V100", vramPerGPU: 16, gpuCount: 1, totalVRAM: 16, priceHourly: 3.06, pricePerGBVRAM: 0.191 },
    { provider: "AWS", name: "p4d.24xlarge", gpu: "A100", vramPerGPU: 40, gpuCount: 8, totalVRAM: 320, priceHourly: 32.77, pricePerGBVRAM: 0.102 },

    // Azure
    { provider: "Azure", name: "NC4as T4 v3", gpu: "T4", vramPerGPU: 16, gpuCount: 1, totalVRAM: 16, priceHourly: 0.53, pricePerGBVRAM: 0.033 },
    { provider: "Azure", name: "ND96asr A100 v4", gpu: "A100", vramPerGPU: 40, gpuCount: 8, totalVRAM: 320, priceHourly: 27.20, pricePerGBVRAM: 0.085 },

    // GCP
    { provider: "GCP", name: "n1-std-4 + T4", gpu: "T4", vramPerGPU: 16, gpuCount: 1, totalVRAM: 16, priceHourly: 0.35, pricePerGBVRAM: 0.022, notes: "Cheapest T4" },
    { provider: "GCP", name: "a2-highgpu-1g", gpu: "A100", vramPerGPU: 40, gpuCount: 1, totalVRAM: 40, priceHourly: 3.67, pricePerGBVRAM: 0.092 },

    // Lambda Labs (The "Disruptor")
    { provider: "Lambda", name: "1x A100 (40GB)", gpu: "A100", vramPerGPU: 40, gpuCount: 1, totalVRAM: 40, priceHourly: 1.10, pricePerGBVRAM: 0.0275, notes: "Unbeatable" },
    { provider: "Lambda", name: "1x H100 (80GB)", gpu: "H100", vramPerGPU: 80, gpuCount: 1, totalVRAM: 80, priceHourly: 2.19, pricePerGBVRAM: 0.027 },
];
