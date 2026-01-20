import { Metadata } from 'next';
import { JsonYamlConverter } from '@/components/tools/json-yaml-converter';

export const metadata: Metadata = {
    title: 'JSON to YAML / YAML to JSON Converter | Database Engineering Suite',
    description: 'Bi-directional converter for JSON and YAML. Essential for debugging Kubernetes manifests, CloudFormation templates, and application config files.',
    keywords: ['json to yaml', 'yaml to json', 'convert json yaml', 'yaml transpiler', 'kubernetes yaml converter'],
};

export default function JsonYamlPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    JSON &lt;&gt; YAML Converter
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Instant, error-free conversion between JSON and YAML formats.
                </p>
            </div>

            <JsonYamlConverter />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>How it works</h3>
                <p>
                    This tool uses <code>js-yaml</code> library to parse and dump data structures.
                </p>
                <ul>
                    <li><strong>Real-time Validation:</strong> Immediately alerts you if your syntax is invalid (e.g., missing colons in YAML or trailing commas in JSON).</li>
                    <li><strong>Lossless:</strong> Preserves primitive types (booleans, numbers, nulls) correctly during conversion.</li>
                    <li><strong>Kubernetes Friendly:</strong> Perfect for converting <code>kubectl get deployment -o json</code> output into clean YAML manifests.</li>
                </ul>
            </div>
        </div>
    );
}
