import { Metadata } from 'next';
import HAProxyConfigCalculator from '@/components/tools/haproxy-config-calculator';

export const metadata: Metadata = {
    title: 'HAProxy Config Calculator | IaC Suite',
    description: 'Generate HAProxy load balancer configurations.',
};

export default function Page() {
    return <HAProxyConfigCalculator />;
}
