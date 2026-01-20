import { Metadata } from 'next';
import ProcfileGenerator from '@/components/tools/procfile-generator';

export const metadata: Metadata = {
    title: 'Procfile Generator | IaC Suite',
    description: 'Generate Procfiles for Heroku, Dokku, and Fly.io apps.',
};

export default function Page() {
    return <ProcfileGenerator />;
}
