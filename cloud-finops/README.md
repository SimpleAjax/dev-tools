# Cloud FinOps Utility Suite

A unified collection of interactive "Engineering as Marketing" tools for Cloud Cost Optimization.
Built with **Next.js 14+**, **Tailwind CSS**, **ShadCN UI**, and **Recharts**.

![Cloud FinOps Dashboard](https://via.placeholder.com/1200x600?text=Cloud+FinOps+Dashboard+Preview)

## 🛠️ The Toolkit (9 Tools)

### 💻 Compute & Serverless
1.  **INF-05 Lambda Cost Estimator**: Visualize the hidden costs of Memory vs. Duration.
2.  **INF-01 EC2 Savings Finder**: Instantly find Spot Instance arbitrage opportunities (Uses dynamic data pipeline).
3.  **INF-09 Azure VM Finder**: "Right-size" your Azure VMs based on CPU/RAM constraints.
4.  **INF-12 GPU VRAM Arbitrage**: Find the cheapest cloud GPU (AWS vs Azure vs Lambda) to host your LLaMA models.

### 💾 Storage & Database
5.  **INF-02 EBS Cost Optimizer**: Break-even analysis for `gp3` vs `io2` storage types.
6.  **INF-07 S3 Lifecycle Visualizer**: Simulate cost decay of moving data to Infrequent Access/Glacier over time.
7.  **INF-04 DynamoDB Planner**: Math out Provisioned (RCU/WCU) vs On-Demand costs.

### 🌐 Networking & Global
8.  **INF-06 NAT Gateway Calculator**: Visualize the "Hidden Tax" of VPC networking.
9.  **INF-11 Global Region Arbitrage Map**: Interactive guide to regional price differences (e.g., Virginia vs. São Paulo).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
git clone https://github.com/yourusername/cloud-finops.git
cd cloud-finops
npm install
```

### Running Locally
```bash
npm run dev
# Open http://localhost:3000
```

### Building for Production
The project is configured for **Static Export** (`output: 'export'`), meaning it generates pure HTML/CSS/JS files.
```bash
npm run build
# Output will be in the /out directory
```

## 🏗️ Architecture

- **Client-Side Only**: No backend server required. All logic runs in the browser.
- **Data Pipeline**: 
  - Run `node scripts/fetch-pricing.js` to regenerate the EC2 pricing dataset.
  - The app fetches this lightweight JSON at runtime.
- **Zero Cost Hosting**: Deploys instantly to Vercel, Netlify, or GitHub Pages.

## 🤝 Contributing
1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/amazing-tool`)
3.  Commit your changes (`git commit -m 'Add Amazing Tool'`)
4.  Push to the branch (`git push origin feature/amazing-tool`)
5.  Open a Pull Request

## 📄 License
MIT
