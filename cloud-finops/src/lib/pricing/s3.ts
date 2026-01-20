export interface S3LifecycleConfig {
    initialStorageTB: number;
    growthRatePercent: number; // Monthly growth
    durationMonths: number;
    transitionIaDays: number; // Move to IA after X days
    transitionGlacierDays: number; // Move to Glacier Deep Archive after X days
}

// Pricing (us-east-1) $/GB-month
const PRICING = {
    standard: 0.023,
    ia: 0.0125,
    glacierDeep: 0.00099,
    // Monitoring/Transition fees ignored for MVP simplicity, focusing on storage cost
};

export function calculateS3Lifecycle(config: S3LifecycleConfig) {
    const { initialStorageTB, durationMonths, transitionIaDays, transitionGlacierDays } = config;

    const dataPoints = [];
    const currentStorageGB = initialStorageTB * 1024;

    // Cumulative Costs
    let totalCostNoLifecycle = 0;
    let totalCostWithLifecycle = 0;

    for (let month = 1; month <= durationMonths; month++) {
        const dayStart = (month - 1) * 30;

        // Calculate split of storage for this month based on age
        // Simplified: We assume all initial data ages together. New growth is always "Standard".
        // Correct simulation:
        // - Age of initial batch = month * 30
        // - Transition logic applies to the initial batch.

        let standardGB = 0;
        let iaGB = 0;
        let glacierGB = 0;

        // Logic: Where is the initial batch?
        if (dayStart >= transitionGlacierDays) {
            glacierGB = currentStorageGB;
        } else if (dayStart >= transitionIaDays) {
            iaGB = currentStorageGB;
        } else {
            standardGB = currentStorageGB;
        }

        // Cost for this month (Lifecycle)
        const costLifecycle = (standardGB * PRICING.standard) +
            (iaGB * PRICING.ia) +
            (glacierGB * PRICING.glacierDeep);

        // Cost for this month (No Lifecycle - All Standard)
        const costNoLifecycle = currentStorageGB * PRICING.standard;

        totalCostWithLifecycle += costLifecycle;
        totalCostNoLifecycle += costNoLifecycle;

        dataPoints.push({
            month: `M${month}`,
            Standard: parseFloat((standardGB / 1024).toFixed(2)),
            InfrequentAccess: parseFloat((iaGB / 1024).toFixed(2)),
            Glacier: parseFloat((glacierGB / 1024).toFixed(2)),
            costLifecycle: costLifecycle,
            costStandard: costNoLifecycle // For comparison line
        });

        // Apply Growth (New data is always standard initially, but we keep it simple for MVP)
        // currentStorageGB = currentStorageGB * (1 + (growthRatePercent/100));
    }

    return {
        dataPoints,
        summary: {
            totalCostNoLifecycle,
            totalCostWithLifecycle,
            savings: totalCostNoLifecycle - totalCostWithLifecycle,
            savingsPercent: (1 - (totalCostWithLifecycle / totalCostNoLifecycle)) * 100
        }
    };
}
