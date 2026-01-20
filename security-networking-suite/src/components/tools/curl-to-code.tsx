"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/tool-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal } from "lucide-react";

type Language = "python" | "node" | "go" | "rust";

export function CurlToCode() {
    const [curl, setCurl] = useState("curl -X POST https://api.example.com/data -H 'Content-Type: application/json' -d '{\"key\":\"value\"}'");
    const [activeTab, setActiveTab] = useState<Language>("python");

    // This is a simplified regex-based parser for demonstration.
    // A robust one would use AST parsing (tree-sitter or similar WASM) which is heavy.
    const convert = (cmd: string, lang: Language): string => {
        try {
            // Extract basic parts
            const urlMatch = cmd.match(/https?:\/\/[^\s']+/);
            const url = urlMatch ? urlMatch[0] : "http://example.com";

            const methodMatch = cmd.match(/-X\s+([A-Z]+)/);
            const method = methodMatch ? methodMatch[1] : (cmd.includes("-d") ? "POST" : "GET");

            const headers: Record<string, string> = {};
            const headerRegex = /-H\s+['"]([^'"]+)['"]/g;
            let match;
            while ((match = headerRegex.exec(cmd)) !== null) {
                const [k, v] = match[1].split(": ");
                if (k && v) headers[k] = v;
            }

            const dataMatch = cmd.match(/-d\s+['"]([^'"]+)['"]/);
            const data = dataMatch ? dataMatch[1] : null;

            // Templating
            if (lang === "python") {
                return `import requests\n\nurl = "${url}"\npayload = ${data ? JSON.stringify(JSON.parse(data)) : "None"}\nheaders = ${JSON.stringify(headers, null, 4)}\n\nresponse = requests.request("${method}", url, headers=headers, json=payload)\n\nprint(response.text)`;
            }

            if (lang === "node") {
                return `const axios = require('axios');\n\nconst options = {\n  method: '${method}',\n  url: '${url}',\n  headers: ${JSON.stringify(headers, null, 4)},\n  data: ${data || 'null'}\n};\n\naxios.request(options).then(function (response) {\n  console.log(response.data);\n}).catch(function (error) {\n  console.error(error);\n});`;
            }

            if (lang === "go") {
                return `package main\n\nimport (\n\t"fmt"\n\t"net/http"\n\t"io/ioutil"\n\t"strings"\n)\n\nfunc main() {\n\turl := "${url}"\n\tmethod := "${method}"\n\tpayload := strings.NewReader(\`${data || ""}\`)\n\n\tclient := &http.Client {}\n\treq, err := http.NewRequest(method, url, payload)\n\n\tif err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n${Object.entries(headers).map(([k, v]) => `\treq.Header.Add("${k}", "${v}")`).join("\n")}\n\n\tres, err := client.Do(req)\n\tif err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n\tdefer res.Body.Close()\n\n\tbody, err := ioutil.ReadAll(res.Body)\n\tif err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n\tfmt.Println(string(body))\n}`;
            }

            if (lang === "rust") {
                return `// [dependencies]\n// reqwest = { version = "0.11", features = ["json"] }\n// tokio = { version = "1", features = ["full"] }\n\nuse std::collections::HashMap;\n\n#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std::error::Error>> {\n    let client = reqwest::Client::new();\n    let resp = client.${method.toLowerCase()}("${url}")\n${Object.entries(headers).map(([k, v]) => `        .header("${k}", "${v}")`).join("\n")}${data ? `\n        .body(r#"${data}"#)` : ""}\n        .send()\n        .await?;\n    println!("{:#?}", resp.text().await?);\n    Ok(()) \n}`;
            }

            return "Unsupported language";

        } catch (e) {
            return "// Error parsing Curl command. Please ensure it follows standard syntax.\n// Complex nested quotes may need manual adjustment.";
        }
    };

    const output = convert(curl, activeTab);

    return (
        <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
            {/* Input */}
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Terminal className="h-5 w-5" /> Curl Command</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                    <textarea
                        className="w-full h-full min-h-[300px] p-4 font-mono text-sm bg-slate-950 text-slate-50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={curl}
                        onChange={(e) => setCurl(e.target.value)}
                        placeholder="Paste curl command here..."
                    />
                </CardContent>
            </Card>

            {/* Output */}
            <Card className="flex flex-col">
                <CardHeader className="py-3 px-6 border-b">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Language)} className="w-full">
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="python">Python</TabsTrigger>
                            <TabsTrigger value="node">Node.js</TabsTrigger>
                            <TabsTrigger value="go">Go</TabsTrigger>
                            <TabsTrigger value="rust">Rust</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative bg-slate-50 dark:bg-slate-900 overflow-hidden">
                    <pre className="h-full p-4 overflow-auto font-mono text-sm">
                        {output}
                    </pre>
                    <div className="absolute top-4 right-4">
                        <CopyButton text={output} className="bg-white dark:bg-black shadow-sm" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
