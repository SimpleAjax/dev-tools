# Cloud Cost FinOps Suite - Implementation Plan

## 1. Executive Summary

This document outlines the strategy for building a **Unified Cloud Cost Utility Suite**. Instead of fragmented individual tools, we will build a single, high-performance Next.js application that houses multiple FinOps calculators. This approach maximizes SEO authority, code reusability, and user engagement.

**Core Value Prop:** "Instant, private, and interactive cloud cost estimation without the complexity of official vendor portals."

## 2. Technical Architecture

### 2.1 Technology Stack
*   **Framework:** Next.js 14+ (App Router) - Static Export (`output: 'export'`) capability for zero-cost hosting.
*   **Styling:** Tailwind CSS + `shadcn/ui` (Radix Primitives).
*   **Visualization:** `recharts` for interactive cost curves and break-even analysis.
*   **State Management:** React Hook Form + Zod (for complex validation) and URL Search Params (shareable configurations).
*   **Icons:** Lucide React.

### 2.2 Data Strategy (The "Build-Time" Core)
Directly querying AWS/GCP APIs from the client is slow and CORS-restricted. We will use a **Static Data Hydration** strategy.
1.  **Ingestion Script:** A Node.js script (`scripts/sync-prices.ts`) runs periodically (e.g., via GitHub Actions).
2.  **Processing:** It fetches raw pricing files (AWS Price List API), filters for relevant regions/SKUs, and minimizes the payload.
3.  **Storage:** Output is saved to `src/data/generated/*.json`.
4.  **Usage:** Components import these JSON files directly. This ensures instant load times and zero runtime external dependencies.

## 3. UX & Interface Design

### 3.1 Design Aesthetic
*   **Theme:** "Financial Instrument" Dark Mode. Deep blues/grays, high-contrast neon accents (green for savings, amber for warnings).
*   **Layout:** Sidebar navigation for easy switching between tools.
*   **Interactivity:** "Slider-first" inputs where possible to encourage exploration (e.g., sliding "Duration" to see cost impact immediately).

### 3.2 ASCII Mockups

**Main Layout (Desktop)**
```text
+----------------+-------------------------------------------------------------+
|  [Logo]        |  Breadcrumbs: Tools > Serverless > Lambda Cost              |
|  CloudFinOps   |                                                             |
+----------------+-------------------------------------------------------------+
|                |  +-------------------------------------------------------+  |
|  SEARCH...     |  |  Tool Title: Lambda Usage Estimator                   |  |
|  Categories    |  |  Subtitle: Avoid sticker shock with real-time math.   |  |
|                |  +-------------------------------------------------------+  |
|  > COMPUTE     |                                                             |
|    EC2 vs Spot |  +-----------------------+   +-----------------------+  |
|    Lambda Calc |  |   INPUT CONFIG        |   |   COST BREAKDOWN      |  |
|    Fargate     |  |                       |   |                       |  |
|                |  |  Requests/Month       |   |   Monthly Bill:       |  |
|                |  |  [ 15,000,000  ]      |   |   $ 124.50            |  |
|  > STORAGE     |  |                       |   |                       |  |
|    EBS Optim.  |  |  Avg Duration (ms)    |   |   [  CHART AREA   ]   |  |
|    S3 Lifecycle|  |  <==O==============>  |   |   |                   |  |
|                |  |  (350ms)              |   |   |   /               |  |
|  > NETWORK     |  |                       |   |   |  /                |  |
|    NAT Gateway |  |  Memory (MB)          |   |   | /                 |  |
|    Egress Calc |  |  [ 1024 RAM  v ]      |   |   |/                  |  |
|                |  |                       |   |   +-------------------+  |
|                |  |  [x] Incl. Free Tier  |   |                       |  |
|                |  +-----------------------+   +-----------------------+  |
|                |                                                             |
+----------------+-------------------------------------------------------------+
```

**Mobile Responsive View**
*   Sidebar collapses into a Hamburger menu.
*   Input Config and Cost Breakdown stack vertically.
*   Charts simplify or hide granular axes on small screens.

## 4. Implementation Roadmap

### Phase 1: The "Math First" Foundation (Weeks 1-2)
Goal: Deploy the shell and tools that rely on stable formulas rather than complex external data.
*   **Setup:** Next.js repo, Tailwind/Shadcn setup, Sidebar layout.
*   **Tool 1: INF-05 Lambda Cost Estimator**
    *   *Inputs:* Requests, Duration, Memory, Ephemeral Storage.
    *   *Logic:* Standard tier pricing ($0.20/1M req + GB-second rate).
    *   *Vis:* Bar chart breaking down Compute vs. Request costs.
*   **Tool 2: INF-02 EBS Throughput (gp3 vs io2)**
    *   *Inputs:* Storage Size (GB), IOPS, Throughput (MB/s).
    *   *Logic:* Compare gp3 (bundled pricing) vs io2 (provisioned).
    *   *Vis:* "Break-even" intersection point graph.
*   **Tool 3: INF-06 NAT Gateway Tax**
    *   *Inputs:* Data Processed (GB).
    *   *Logic:* NAT Gateway hourly + processing fee vs. VPC Endpoints.

### Phase 2: The "Data Heavy" Core (Weeks 3-4)
Goal: Integrate the build-time data ingestion for dynamic pricing.
*   **Infrastructure:** Build `scripts/fetch-aws-pricing.json`.
*   **Tool 4: INF-01 EC2 Spot vs. On-Demand**
    *   *Complexity:* Needs huge JSON map of Region -> InstanceType -> Price.
    *   *Feature:* Searchable dropdown "Find m5.large".
    *   **Data Pipeline:** `scripts/fetch-aws-pricing.ts` now powers this.
*   **Tool 5: INF-09 Azure VM Finder**
    *   *Complexity:* Filter logic (e.g., "Show me all instances with > 64GB RAM under $200/mo").

### Phase 3: Advanced Visualizations (Week 5+)
*   **Tool 6: INF-07 S3 Lifecycle Visualizer**
    *   *Vis:* D3/Recharts stacked area chart showing storage decay over time.
*   **Tool 7: INF-04 DynamoDB Planner**
    *   *Logic:* Read/Write Capacity Unit formulas.

### Phase 4: Viral & Niche Tools (Optimization Focus)
New additions focusing on "Engineering as Marketing" - highly shareable, niche auditors.
*   **Tool 8: INF-12 GPU VRAM Arbitrage Finder**
    *   *Target:* AI/ML Engineers.
    *   *Logic:* Compare AWS/GCP/Azure GPU instances specifically by "Price per GB of VRAM".
    *   *Marketing:* "Cheapest place to fine-tune LLaMA 3 70B."
*   **Tool 9: INF-11 Global Region Arbitrage Map**
    *   *Target:* CTOs/Architects.
    *   *Vis:* World Heatmap showing relative price differences (e.g. "Ohio is 10% cheaper than Virginia").
    *   *Tech:* SVG Map + Relative Pricing JSON index.
*   **Tool 10: INF-13 EBS "Zombie" Hunter (CSV Auditor)**
    *   *Target:* Ops Teams.
    *   *Features:* Client-side CSV parsing (PapaParse). User drags EC2 Volume export.
    *   *Output:* Sum of `Available` volumes cost. Zero data leaves browser.
*   **Tool 11: INF-14 Startup Unit Cost Modeler**
    *   *Target:* SaaS Founders.
    *   *Logic:* Margin calculator based on Server Cost / Avg Requests / Customer Count.

## 5. Detailed Implementation Specs (Phase 1)

### 5.1 Project Structure
```bash
/apps/cloud-finops
├── public/
│   └── data/           # Generated pricing JSONs
├── src/
│   ├── components/
│   │   ├── ui/         # Shadcn primitives
│   │   ├── layout/     # AppShell, Sidebar
│   │   └── charts/     # Reusable Recharts wrappers
│   ├── lib/
│   │   ├── pricing/    # Core math functions (pure logic)
│   │   └── hooks/      # usePricing, useCurrency
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx    # Dashboard / Index
│   │   └── tools/
│   │       ├── lambda-cost/
│   │       │   ├── page.tsx
│   │       │   └── _components/calculators.tsx
│   │       └── ebs-optimizer/
│   │           └── ...
```

### 5.2 Key Component: `CostChart.tsx`
A wrapper around Recharts to standardize the look:
*   Standard X/Y Axis styling (clean, grid lines).
*   ResponsiveContainer built-in.
*   Custom Toolkit with currency formatting.

### 5.3 Shared Utility: `useFormSync`
A hook to sync form state to URL query parameters instantly.
*   *Why?* Users want to share a calculation: "Look, here is the cost breakdown for our new architecture" -> sends link.
*   *Tech:* `next/navigation` router.replace + `useSearchParams`.

## 6. Next Steps
1.  Initialize Next.js project.
2.  Install Shadcn UI (Button, Input, Slider, Card, Select, Switch).
3.  Build the Shell (Sidebar + Main Content Area).
4.  Implement `INF-05` (Lambda) first as it's the "Hello World" of this suite.
