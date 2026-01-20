export interface LambdaConfig {
    region: string;
    architecture: "x86" | "arm";
    memoryMB: number;
    ephemeralStorageMB: number;
    requestsPerMonth: number;
    avgDurationMs: number;
    includeFreeTier: boolean;
}

// Simplified Pricing Constants (us-east-1 standard)
// Real implementation would pull this from the generated JSON
const PRICING = {
    request: 0.20 / 1_000_000, // per request
    compute: {
        x86: 0.0000166667, // per GB-second
        arm: 0.0000133334, // per GB-second
    },
    storage: 0.0000000309, // per GB-second (beyond 512MB)
    freeTier: {
        requests: 1_000_000,
        computeSeconds: 400_000, // GB-seconds
    }
};

export const MEMORY_OPTIONS = [
    128, 512, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 10240
];

export function calculateLambdaCost(config: LambdaConfig) {
    const {
        requestsPerMonth,
        avgDurationMs,
        memoryMB,
        architecture,
        includeFreeTier
    } = config;

    // 1. Calculate Request Costs
    let billableRequests = requestsPerMonth;
    if (includeFreeTier) {
        billableRequests = Math.max(0, billableRequests - PRICING.freeTier.requests);
    }
    const requestCost = billableRequests * PRICING.request;

    // 2. Calculate Compute Costs
    // Lambda charges in 1ms increments
    const secondsPerRequest = avgDurationMs / 1000;
    const totalSeconds = requestsPerMonth * secondsPerRequest;
    const memoryGB = memoryMB / 1024;
    const totalGBSeconds = totalSeconds * memoryGB;

    let billableGBSeconds = totalGBSeconds;
    if (includeFreeTier) {
        billableGBSeconds = Math.max(0, billableGBSeconds - PRICING.freeTier.computeSeconds);
    }

    const computeRate = PRICING.compute[architecture];
    const computeCost = billableGBSeconds * computeRate;

    // 3. Ephemeral Storage (Not implementing extra storage math yet as it's complex/rare for simple calc)
    const storageCost = 0;

    return {
        total: requestCost + computeCost + storageCost,
        breakdown: {
            requests: requestCost,
            compute: computeCost,
            storage: storageCost,
        },
        metrics: {
            totalRequests: requestsPerMonth,
            totalComputeSeconds: totalSeconds,
            totalGBSeconds: totalGBSeconds
        }
    };
}
