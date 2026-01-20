export interface EBSConfig {
    storageGB: number;
    iops: number;
    throughputMBs: number;
}

// Pricing constants (us-east-1 generic)
const PRICING = {
    gp3: {
        storage: 0.08, // per GB
        freeIops: 3000,
        iopsRate: 0.005, // per IOPS above 3000
        freeThroughput: 125,
        throughputRate: 0.040, // per MB/s above 125
    },
    io2: {
        storage: 0.125, // per GB
        // io2 has tiered IOPS pricing, simplified here for MVP
        // Tier 1: Up to 32,000 IOPS
        iopsRateTier1: 0.065,
        // Tier 2: 32,001 to 64,000 (0.046) - ignoring for MVP simplicity
    }
};

export function calculateEBSCost(config: EBSConfig) {
    const { storageGB, iops, throughputMBs } = config;

    // --- GP3 Calculation ---
    const gp3StorageCost = storageGB * PRICING.gp3.storage;

    const billableGp3Iops = Math.max(0, iops - PRICING.gp3.freeIops);
    const gp3IopsCost = billableGp3Iops * PRICING.gp3.iopsRate;

    const billableGp3Throughput = Math.max(0, throughputMBs - PRICING.gp3.freeThroughput);
    const gp3ThroughputCost = billableGp3Throughput * PRICING.gp3.throughputRate;

    const gp3Total = gp3StorageCost + gp3IopsCost + gp3ThroughputCost;

    // --- IO2 Calculation ---
    // io2 throughput scales with IOPS (approx 0.256 KB per IOPS, up to 1000MB/s per volume)
    // We assume here the user gets the throughput they need via IOPS, io2 doesn't have explicit throughput pricing.
    const io2StorageCost = storageGB * PRICING.io2.storage;
    const io2IopsCost = iops * PRICING.io2.iopsRateTier1; // Simplified flat tier 1

    const io2Total = io2StorageCost + io2IopsCost;

    return {
        gp3: {
            total: gp3Total,
            breakdown: {
                storage: gp3StorageCost,
                iops: gp3IopsCost,
                throughput: gp3ThroughputCost
            }
        },
        io2: {
            total: io2Total,
            breakdown: {
                storage: io2StorageCost,
                iops: io2IopsCost,
                throughput: 0
            }
        },
        recommendation: gp3Total < io2Total ? 'gp3' : 'io2',
        savings: Math.abs(gp3Total - io2Total)
    };
}

// Generate data points for a "Cost vs IOPS" chart
export function generateBreakEvenData(storageGB: number, throughputMBs: number) {
    // Generate points from 3,000 to 80,000 IOPS
    const points = [];
    for (let i = 3000; i <= 60000; i += 3000) {
        const cost = calculateEBSCost({ storageGB, iops: i, throughputMBs });
        points.push({
            iops: i,
            gp3: cost.gp3.total,
            io2: cost.io2.total
        });
    }
    return points;
}
