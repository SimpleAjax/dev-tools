import { Metadata } from 'next';
import { ErdToSqlGenerator } from '@/components/tools/erd-to-sql-generator';

export const metadata: Metadata = {
    title: 'ER Diagram to SQL Generator | Database Engineering Suite',
    description: 'Convert Mermaid.js ER diagrams to SQL CREATE TABLE statements. Visualize your schema and generate DDL instantly.',
    keywords: ['erd to sql', 'mermaid to sql', 'text to sql', 'database schema generator', 'visual database designer'],
};

export default function ErdToSqlPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    ER Diagram to SQL Generator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Write simple schema text, get a visual diagram + executable SQL code.
                </p>
            </div>

            <ErdToSqlGenerator />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>How to use</h3>
                <p>
                    This tool uses the <strong>Mermaid.js</strong> syntax for Entity Relationship Diagrams.
                </p>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md text-sm">
                    {`erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int id PK
        int total
    }`}
                </pre>
                <ul>
                    <li>Use <code>string</code>, <code>int</code>, <code>float</code>, <code>boolean</code>, <code>datetime</code> for types.</li>
                    <li>Add <code>PK</code> for Primary Key (auto-detected by generator).</li>
                    <li>The SQL generator converts these generic types to specific PostgreSQL or MySQL types automatically.</li>
                </ul>
            </div>
        </div>
    );
}
