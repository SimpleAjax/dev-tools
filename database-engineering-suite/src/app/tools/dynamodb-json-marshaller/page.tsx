import { Metadata } from 'next';
import { DynamoDbMarshaller } from '@/components/tools/dynamodb-json-marshaller';

export const metadata: Metadata = {
    title: 'DynamoDB JSON Marshaller / Unmarshaller | Database Engineering Suite',
    description: 'Convert standard JSON to DynamoDB JSON format (AttributeValues) and vice-versa. Essential for debugging AWS DynamoDB items.',
    keywords: ['dynamodb json converter', 'dynamodb marshaller', 'dynamodb unmarshal', 'aws dynamodb json format', 'dynamodb attribute values'],
};

export default function DynamoDbJsonPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    DynamoDB JSON Marshaller
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Translate between normal JSON and the verbose DynamoDB AttributeValue format (<code>&#123; "S": "value" &#125;</code>).
                </p>
            </div>

            <DynamoDbMarshaller />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>About DynamoDB JSON</h3>
                <p>
                    DynamoDB uses a typed JSON format where every value is wrapped in a type descriptor.
                </p>
                <ul>
                    <li><code>S</code>: String</li>
                    <li><code>N</code>: Number (as string)</li>
                    <li><code>BOOL</code>: Boolean</li>
                    <li><code>M</code>: Map</li>
                    <li><code>L</code>: List</li>
                </ul>
            </div>
        </div>
    );
}
