import {
    Server,
    Share2,
    Shield,
    Activity,
    Database,
    Clock,
    Network,
    Cpu,
    Layers,
    Filter,
    Zap,
    Scale,
    Lock,
    GitBranch,
    BarChart3,
    CheckCircle
} from "lucide-react";

export interface ToolItem {
    name: string;
    href: string;
    icon: any;
    description: string;
}

export interface ToolGroup {
    name: string;
    items: ToolItem[];
}

export const TOOLS: ToolGroup[] = [
    {
        name: "Consensus & Topology",
        items: [
            {
                name: "Raft Consensus Simulator",
                href: "/tools/raft-consensus",
                icon: Server,
                description: "Interactive visualization of Leader Election & Log Replication."
            },
            {
                name: "Consistent Hashing Ring",
                href: "/tools/consistent-hashing",
                icon: Share2,
                description: "Visualize data distribution and rebalancing when adding/removing nodes."
            },
            {
                name: "Gossip Protocol Visualizer",
                href: "/tools/gossip-protocol",
                icon: Network,
                description: "Simulate epidemic broadcast algorithms (SWIM) for cluster membership."
            },
            {
                name: "Vector Clocks",
                href: "/tools/vector-clock",
                icon: Clock,
                description: "Track causality in distributed systems using logical time vectors."
            },
            {
                name: "CAP Theorem Explorer",
                href: "/tools/cap-theorem",
                icon: Scale,
                description: "Explore the tradeoffs between Consistency, Availability, and Partition Tolerance."
            },
            {
                name: "2-Phase Commit (2PC)",
                href: "/tools/two-phase-commit",
                icon: Lock,
                description: "Visualize atomic distributed transactions and the blocking problem."
            },
        ],
    },
    {
        name: "Resiliency & Stability",
        items: [
            {
                name: "Load Balancer Simulator",
                href: "/tools/load-balancer",
                icon: Cpu,
                description: "Compare Round Robin, Least Connections, and IP Hash algorithms."
            },
            {
                name: "Rate Limiter",
                href: "/tools/rate-limiter",
                icon: Filter,
                description: "Token Bucket vs Leaky Bucket algorithms for throttling traffic."
            },
            {
                name: "Circuit Breaker",
                href: "/tools/circuit-breaker",
                icon: Zap,
                description: "State machine visualizer for failing fast and recovering gracefully."
            },
            {
                name: "Exponential Backoff",
                href: "/tools/backoff-calc",
                icon: Activity,
                description: "Calculate retry intervals with Jitter to prevent Thundering Herds."
            },
        ],
    },
    {
        name: "Database Internals",
        items: [
            {
                name: "Sharding Strategy",
                href: "/tools/sharding-strategy",
                icon: Layers,
                description: "Visualize Range vs Hash sharding and identify hotspots."
            },
            {
                name: "Quorum Tuner (R+W>N)",
                href: "/tools/quorum-tuner",
                icon: CheckCircle,
                description: "Configure N, R, W parameters to achieve Strong Consistency."
            },
            {
                name: "SQL Index B-Tree",
                href: "/tools/btree-vis",
                icon: GitBranch,
                description: "Interactive B-Tree structure showing node splitting and balancing."
            },
            {
                name: "Bloom Filter Calculator",
                href: "/tools/bloom-filter",
                icon: Filter,
                description: "Probabilistic data structure for efficient existence checks."
            },
            {
                name: "Cache Eviction Sim",
                href: "/tools/cache-eviction",
                icon: Database,
                description: "Visualize LRU, LFU, and FIFO eviction policies."
            },
        ],
    },
];
