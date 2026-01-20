import { Metadata } from 'next';
import NginxConfigGenerator from '@/components/tools/nginx-config-generator';

export const metadata: Metadata = {
    title: 'Nginx Config Generator | IaC Suite',
    description: 'Generate production-ready Nginx configuration files.',
};

export default function Page() {
    return <NginxConfigGenerator />;
}
