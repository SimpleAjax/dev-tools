import { Metadata } from 'next';
import CloudInitGenerator from '@/components/tools/cloud-init-generator';

export const metadata: Metadata = {
    title: 'Cloud-Init Generator | IaC Suite',
    description: 'Generate cloud-config YAML for bootstrapping cloud instances.',
};

export default function Page() {
    return <CloudInitGenerator />;
}
