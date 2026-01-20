// Azure VM Instances Seed Data (East US)
// Prices are estimated Pay-as-you-go hourly

export interface AzureInstance {
    name: string;
    vCPUs: number;
    memoryGB: number;
    priceHourly: number; // Pay as you go
    priceSpot: number;   // Spot estimate
    family: string;
}

export const AZURE_INSTANCES: AzureInstance[] = [
    // General Purpose (D-Series)
    { name: "D2s v5", vCPUs: 2, memoryGB: 8, priceHourly: 0.096, priceSpot: 0.019, family: "General Purpose" },
    { name: "D4s v5", vCPUs: 4, memoryGB: 16, priceHourly: 0.192, priceSpot: 0.038, family: "General Purpose" },
    { name: "D8s v5", vCPUs: 8, memoryGB: 32, priceHourly: 0.384, priceSpot: 0.077, family: "General Purpose" },

    // Compute Optimized (F-Series)
    { name: "F2s v2", vCPUs: 2, memoryGB: 4, priceHourly: 0.085, priceSpot: 0.017, family: "Compute Optimized" },
    { name: "F4s v2", vCPUs: 4, memoryGB: 8, priceHourly: 0.169, priceSpot: 0.034, family: "Compute Optimized" },
    { name: "F8s v2", vCPUs: 8, memoryGB: 16, priceHourly: 0.338, priceSpot: 0.068, family: "Compute Optimized" },

    // Memory Optimized (E-Series)
    { name: "E2s v5", vCPUs: 2, memoryGB: 16, priceHourly: 0.123, priceSpot: 0.025, family: "Memory Optimized" },
    { name: "E4s v5", vCPUs: 4, memoryGB: 32, priceHourly: 0.246, priceSpot: 0.049, family: "Memory Optimized" },

    // Burstable (B-Series) - "The Cheap Ones"
    { name: "B2s", vCPUs: 2, memoryGB: 4, priceHourly: 0.0416, priceSpot: 0.008, family: "Burstable" },
    { name: "B2ms", vCPUs: 2, memoryGB: 8, priceHourly: 0.0832, priceSpot: 0.016, family: "Burstable" },
];
