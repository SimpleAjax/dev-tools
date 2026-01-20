'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Code2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TerraformPolicyGenerator() {
    const [policies, setPolicies] = useState({
        requireTags: true,
        restrictInstanceType: false,
        enforceTls: false,
        limitCost: false,
    });

    const togglePolicy = (key: keyof typeof policies) => {
        setPolicies({ ...policies, [key]: !policies[key] });
    };

    const generateOpa = () => {
        let output = `package terraform.analysis\n\nimport input as tfplan\n\ndefault allow = false\n\n`;

        // Require Tags
        if (policies.requireTags) {
            output += `# Rule: Require tags on all resources\n`;
            output += `deny[msg] {\n`;
            output += `  r := tfplan.resource_changes[_]\n`;
            output += `  not r.change.after.tags\n`;
            output += `  msg := sprintf("Resource %v is missing tags", [r.address])\n`;
            output += `}\n\n`;
        }

        // Restrict Instance Types
        if (policies.restrictInstanceType) {
            output += `# Rule: Restrict allowed instance types (t2.micro only)\n`;
            output += `allowed_types = ["t2.micro"]\n`;
            output += `deny[msg] {\n`;
            output += `  r := tfplan.resource_changes[_]\n`;
            output += `  r.type == "aws_instance"\n`;
            output += `  not r.change.after.instance_type == allowed_types[_]\n`;
            output += `  msg := sprintf("Instance type %v is not allowed", [r.change.after.instance_type])\n`;
            output += `}\n\n`;
        }

        // Enforce TLS (Example for S3 or ALB)
        if (policies.enforceTls) {
            output += `# Rule: Enforce TLS/SSL\n`;
            output += `deny[msg] {\n`;
            output += `  r := tfplan.resource_changes[_]\n`;
            output += `  r.type == "aws_alb_listener"\n`;
            output += `  r.change.after.protocol != "HTTPS"\n`;
            output += `  msg := sprintf("Listener %v must use HTTPS", [r.address])\n`;
            output += `}\n\n`;
        }

        if (!output.includes('deny')) {
            output += `# No active policies selected.\nallow = true`;
        }

        return output;
    };

    const generateSentinel = () => {
        let output = `import "tfplan/v2" as tfplan\n\n`;

        if (policies.requireTags) {
            output += `# Rule: Require tags\n`;
            output += `mandatory_tags = ["Name", "Environment"]\n`;
            output += `ensure_tags = rule {\n`;
            output += `    all tfplan.resource_changes as _, rc {\n`;
            output += `        rc.change.after.tags contains mandatory_tags\n`;
            output += `    }\n`;
            output += `}\n\n`;
            output += `main = rule { ensure_tags }\n`;
        } else {
            output += `main = rule { true }\n`;
        }

        return output;
    };

    const opaOutput = generateOpa();
    const sentinelOutput = generateSentinel();
    const [activeTab, setActiveTab] = useState('opa');

    const copyToClipboard = () => navigator.clipboard.writeText(activeTab === 'opa' ? opaOutput : sentinelOutput);

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            <div className="space-y-6 overflow-y-auto pr-2 pb-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Policy Rules</CardTitle>
                        <CardDescription>Select logic to enforce on your infrastructure.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2 border p-4 rounded bg-slate-50 dark:bg-slate-900/50">
                            <Checkbox id="tags" checked={policies.requireTags} onCheckedChange={() => togglePolicy('requireTags')} />
                            <label htmlFor="tags" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Enforce Mandatory Tags
                            </label>
                        </div>
                        <div className="flex items-center space-x-2 border p-4 rounded bg-slate-50 dark:bg-slate-900/50">
                            <Checkbox id="instance" checked={policies.restrictInstanceType} onCheckedChange={() => togglePolicy('restrictInstanceType')} />
                            <label htmlFor="instance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Restrict Instance Types (e.g. t2.micro only)
                            </label>
                        </div>
                        <div className="flex items-center space-x-2 border p-4 rounded bg-slate-50 dark:bg-slate-900/50">
                            <Checkbox id="tls" checked={policies.enforceTls} onCheckedChange={() => togglePolicy('enforceTls')} />
                            <label htmlFor="tls" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Enforce HTTPS/TLS
                            </label>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col h-full">
                <Card className="h-full flex flex-col border-slate-200 dark:border-slate-800 bg-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-800 bg-slate-900/50 rounded-t-xl text-slate-50">
                        <Tabs defaultValue="opa" className="w-[200px]" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2 h-8">
                                <TabsTrigger value="opa" className="text-xs">OPA (Rego)</TabsTrigger>
                                <TabsTrigger value="sentinel" className="text-xs">Sentinel</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Button size="sm" variant="secondary" className="h-8" onClick={copyToClipboard}>
                            <Copy className="w-3 h-3 mr-2" /> Copy
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <textarea
                            className="w-full h-full bg-transparent text-slate-50 p-6 font-mono text-sm resize-none focus:outline-none"
                            value={activeTab === 'opa' ? opaOutput : sentinelOutput}
                            readOnly
                            spellCheck="false"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
