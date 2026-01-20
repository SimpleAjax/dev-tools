export interface NetworkConfig {
    dataProcessedGB: number;
    natGatewaysCount: number;
}

// Pricing constants (us-east-1)
const PRICING = {
    natGateway: {
        hourly: 0.045, // per hour
        processing: 0.045, // per GB
    },
    vpcEndpoint: {
        interface: {
            hourly: 0.01, // per hour per AZ
            processing: 0.01, // per GB (tier 1 < 1PB)
        },
        gateway: {
            hourly: 0,
            processing: 0,
        }
    }
};

const HOURS_IN_MONTH = 730;

export function calculateNatCost(config: NetworkConfig) {
    const { dataProcessedGB, natGatewaysCount } = config;

    // 1. NAT Gateway Cost (The status quo)
    const natHourlyCost = natGatewaysCount * PRICING.natGateway.hourly * HOURS_IN_MONTH;
    const natProcessingCost = dataProcessedGB * PRICING.natGateway.processing;
    const natTotal = natHourlyCost + natProcessingCost;

    // 2. Optimization Scenario: VPC Ednpoints
    // Assumption: 70% of traffic is often S3/DynamoDB (Gateway Endpoint - Free) 
    // and 30% is other AWS services (Interface Endpoint - Cheaper)
    // This is a heuristic for the "Potential Savings" visualization

    // Scenario A: Move S3 traffic to Gateway Endpoint
    const s3Traffic = dataProcessedGB * 0.5; // Assume 50% is S3
    const remainingTraffic = dataProcessedGB * 0.5;

    // Cost with Gateway Endpoint for S3 (Free) + NAT for rest
    const optimizedProcessingCost = (remainingTraffic * PRICING.natGateway.processing) + (s3Traffic * 0);
    const optimizedTotal = natHourlyCost + optimizedProcessingCost;

    return {
        current: {
            total: natTotal,
            hourly: natHourlyCost,
            processing: natProcessingCost
        },
        optimized: {
            total: optimizedTotal,
            savings: natTotal - optimizedTotal
        },
        pricing: PRICING
    };
}
