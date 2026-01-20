'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import yaml from 'js-yaml';

export default function AnsibleValidator() {
    const [input, setInput] = useState(`---
- name: Update web servers
  hosts: webservers
  remote_user: root

  tasks:
  - name: Ensure apache is at the latest version
    ansible.builtin.yum:
      name: httpd
      state: latest
`);
    const [validation, setValidation] = useState<{ isValid: boolean; message: string; errorLine?: number } | null>(null);

    useEffect(() => {
        if (!input.trim()) {
            setValidation(null);
            return;
        }

        try {
            const doc = yaml.load(input);
            // Basic schema validation check (very high level)
            if (!Array.isArray(doc)) {
                throw new Error("Ansible Playbooks must be a list of plays (start with '- name: ...')");
            }

            doc.forEach((play: any, idx: number) => {
                if (typeof play !== 'object' || !play) throw new Error(`Play #${idx + 1} is not a valid object.`);
                if (!play.hosts) throw new Error(`Play #${idx + 1} is missing 'hosts' attribute.`);
                if (!play.tasks && !play.roles) throw new Error(`Play #${idx + 1} must have 'tasks' or 'roles'.`);
            });

            setValidation({ isValid: true, message: "Valid Ansible Playbook syntax." });
        } catch (e: any) {
            let message = e.message;
            let line = undefined;

            if (e.mark && e.mark.line) {
                line = e.mark.line + 1;
                message = `Line ${line}: ${e.reason || e.message}`;
            }

            setValidation({ isValid: false, message, errorLine: line });
        }
    }, [input]);

    const copyToClipboard = () => navigator.clipboard.writeText(input);

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Ansible Playbook Validator</h2>
                    <p className="text-muted-foreground">Checks YAML syntax and basic Ansible structure.</p>
                </div>
                {validation && (
                    <Alert variant={validation.isValid ? "default" : "destructive"} className={`w-fit ${validation.isValid ? "border-green-500 text-green-600 dark:text-green-400" : ""}`}>
                        {validation.isValid ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <AlertTitle>{validation.isValid ? "Valid" : "Invalid"}</AlertTitle>
                        <AlertDescription>{validation.message}</AlertDescription>
                    </Alert>
                )}
            </div>

            <Card className="flex-1 flex flex-col border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">playbook.yml</span>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8" onClick={copyToClipboard}>
                        <Copy className="w-3 h-3 mr-2" /> Copy
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                    <textarea
                        className="w-full h-full bg-transparent p-6 font-mono text-sm resize-none focus:outline-none"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        spellCheck="false"
                        placeholder="Paste your Ansible playbook here..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}
