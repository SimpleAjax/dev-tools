---
description: Setup a new Next.js project with Tailwind and Shadcn UI.
---

1. Initialize Next.js project non-interactively
```bash
npx -y create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

2. Initialize Shadcn UI
```bash
npx shadcn@latest init -d
```

3. Install common UI components (Card, Button, Input, Label, Badge, Switch, Slider)
```bash
npx shadcn@latest add card button input label badge switch slider tooltip alert dialog sheet
```

4. Install Lucide Icons (usually installed by shadcn but good to ensure)
```bash
npm install lucide-react
```
