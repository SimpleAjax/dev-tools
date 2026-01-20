export interface RegionData {
    id: string;
    name: string;
    location: string;
    continent: "North America" | "South America" | "Europe" | "Asia Pacific" | "Middle East" | "Africa";
    priceIndex: number; // Base 100 = us-east-1. 110 = 10% more expensive.
    lat: number;
    long: number;
}

// Data approximation based on typical EC2/RDS pricing variance
// Base: US East (N. Virginia) = 100
export const REGION_PRICING: RegionData[] = [
    // North America
    { id: "us-east-1", name: "US East (N. Virginia)", location: "Virginia", continent: "North America", priceIndex: 100, lat: 38, long: -78 },
    { id: "us-east-2", name: "US East (Ohio)", location: "Ohio", continent: "North America", priceIndex: 100, lat: 40, long: -82 },
    { id: "us-west-1", name: "US West (N. California)", location: "California", continent: "North America", priceIndex: 112, lat: 37, long: -121 },
    { id: "us-west-2", name: "US West (Oregon)", location: "Oregon", continent: "North America", priceIndex: 100, lat: 45, long: -119 },
    { id: "ca-central-1", name: "Canada (Central)", location: "Montreal", continent: "North America", priceIndex: 110, lat: 45, long: -73 },

    // South America
    { id: "sa-east-1", name: "South America (São Paulo)", location: "São Paulo", continent: "South America", priceIndex: 154, lat: -23, long: -46 },

    // Europe
    { id: "eu-west-1", name: "Europe (Ireland)", location: "Dublin", continent: "Europe", priceIndex: 110, lat: 53, long: -6 },
    { id: "eu-west-2", name: "Europe (London)", location: "London", continent: "Europe", priceIndex: 116, lat: 51, long: 0 },
    { id: "eu-central-1", name: "Europe (Frankfurt)", location: "Frankfurt", continent: "Europe", priceIndex: 114, lat: 50, long: 8 },
    { id: "eu-north-1", name: "Europe (Stockholm)", location: "Stockholm", continent: "Europe", priceIndex: 104, lat: 59, long: 18 },
    { id: "eu-south-1", name: "Europe (Milan)", location: "Milan", continent: "Europe", priceIndex: 118, lat: 45, long: 9 },

    // Asia Pacific
    { id: "ap-south-1", name: "Asia Pacific (Mumbai)", location: "Mumbai", continent: "Asia Pacific", priceIndex: 96, lat: 19, long: 72 },
    { id: "ap-southeast-1", name: "Asia Pacific (Singapore)", location: "Singapore", continent: "Asia Pacific", priceIndex: 114, lat: 1, long: 103 },
    { id: "ap-northeast-1", name: "Asia Pacific (Tokyo)", location: "Tokyo", continent: "Asia Pacific", priceIndex: 118, lat: 35, long: 139 },
    { id: "ap-northeast-2", name: "Asia Pacific (Seoul)", location: "Seoul", continent: "Asia Pacific", priceIndex: 118, lat: 37, long: 126 },
    { id: "ap-southeast-2", name: "Asia Pacific (Sydney)", location: "Sydney", continent: "Asia Pacific", priceIndex: 120, lat: -33, long: 151 },

    // Middle East & Africa
    { id: "me-south-1", name: "Middle East (Bahrain)", location: "Bahrain", continent: "Middle East", priceIndex: 110, lat: 26, long: 50 },
    { id: "af-south-1", name: "Africa (Cape Town)", location: "Cape Town", continent: "Africa", priceIndex: 122, lat: -33, long: 18 },
];

export function getPricingColor(index: number) {
    if (index < 100) return "bg-emerald-500"; // Cheaper than base
    if (index === 100) return "bg-blue-500"; // Base
    if (index <= 110) return "bg-yellow-500"; // Moderate
    if (index <= 120) return "bg-orange-500"; // Expensive
    return "bg-red-500"; // Very Expensive
}
