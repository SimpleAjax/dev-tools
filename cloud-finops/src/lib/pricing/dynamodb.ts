export interface DynamoConfig {
    avgItemSizeKB: number;
    readConsistency: "strong" | "eventual" | "transactional";
    writeType: "standard" | "transactional";
    readsPerSecond: number;
    writesPerSecond: number;
    storageGB: number;
    percentageUtilization: number; // For provisioned capacity cushion
}

// Pricing (us-east-1)
const PRICING = {
    storage: 0.25, // per GB-month

    onDemand: {
        write: 1.25, // per million WRU
        read: 0.25,   // per million RRU
    },

    provisioned: {
        wcu: 0.00065, // per WCU-hour
        rcu: 0.00013, // per RCU-hour
    }
};

const HOURS_MONTH = 730;

export function calculateDynamoCost(config: DynamoConfig) {
    const {
        avgItemSizeKB,
        readConsistency,
        writeType,
        readsPerSecond,
        writesPerSecond,
        storageGB,
        percentageUtilization
    } = config;

    // 1. Calculate Unit Sizes
    // Writes are in 1KB chunks. Reads in 4KB chunks.
    const writeChunkSize = 1;
    const readChunkSize = 4;

    const writeUnitsPerItem = Math.ceil(avgItemSizeKB / writeChunkSize) * (writeType === 'transactional' ? 2 : 1);

    let readUnitsPerItem = Math.ceil(avgItemSizeKB / readChunkSize);
    if (readConsistency === 'strong') readUnitsPerItem *= 1;
    if (readConsistency === 'eventual') readUnitsPerItem *= 0.5;
    if (readConsistency === 'transactional') readUnitsPerItem *= 2;


    // 2. On-Demand Calculation (Pay per Request)
    // Total Requests per month
    const totalWrites = writesPerSecond * 3600 * HOURS_MONTH;
    const totalReads = readsPerSecond * 3600 * HOURS_MONTH;

    const totalWRU = totalWrites * writeUnitsPerItem;
    const totalRRU = totalReads * readUnitsPerItem;

    const costOnDemand = (
        (totalWRU / 1000000) * PRICING.onDemand.write +
        (totalRRU / 1000000) * PRICING.onDemand.read
    );


    // 3. Provisioned Calculation (Pay per Capacity)
    // We need to provision enough for the PEAK or AVERAGE / Utilization
    const requiredWCU = (writesPerSecond * writeUnitsPerItem) / (percentageUtilization / 100);
    const requiredRCU = (readsPerSecond * readUnitsPerItem) / (percentageUtilization / 100);

    const costProvisioned = (
        (requiredWCU * PRICING.provisioned.wcu * HOURS_MONTH) +
        (requiredRCU * PRICING.provisioned.rcu * HOURS_MONTH)
    );

    const costStorage = storageGB * PRICING.storage;

    return {
        onDemand: {
            total: costOnDemand + costStorage,
            breakdown: { requests: costOnDemand, storage: costStorage }
        },
        provisioned: {
            total: costProvisioned + costStorage,
            breakdown: { capacity: costProvisioned, storage: costStorage },
            units: { rcu: Math.ceil(requiredRCU), wcu: Math.ceil(requiredWCU) }
        },
        recommendation: costOnDemand < costProvisioned ? 'On-Demand' : 'Provisioned',
        savings: Math.abs(costOnDemand - costProvisioned)
    };
}
