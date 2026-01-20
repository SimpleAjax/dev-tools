import { Metadata } from 'next';
import { XmlJsonConverter } from '@/components/tools/xml-json-converter';

export const metadata: Metadata = {
    title: 'XML to JSON / JSON to XML Converter | Database Engineering Suite',
    description: 'Bi-directional XML <-> JSON converter. Built with fast-xml-parser for high performance.',
    keywords: ['xml to json', 'json to xml', 'xml parser online', 'xml converter', 'soap to json'],
};

export default function XmlJsonPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    XML &lt;&gt; JSON Converter
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Parse legacy XML payloads into modern JSON or generate XML from JSON objects.
                </p>
            </div>

            <XmlJsonConverter />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>Features</h3>
                <ul>
                    <li><strong>Bi-directional:</strong> Convert both ways instantly.</li>
                    <li><strong>Attribute Handling:</strong> Choose to preserve XML attributes (prefixed with <code>@_</code>) or ignore them for a cleaner JSON structure.</li>
                    <li><strong>Privacy:</strong> All processing is done 100% client-side. No API calls.</li>
                </ul>
            </div>
        </div>
    );
}
