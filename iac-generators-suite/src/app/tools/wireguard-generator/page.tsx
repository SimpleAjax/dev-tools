import { Metadata } from 'next';
import WireGuardGenerator from '@/components/tools/wireguard-generator';

export const metadata: Metadata = {
    title: 'WireGuard Config Generator | IaC Suite',
    description: 'Generate WireGuard keys and configuration files securely in your browser.',
};

export default function Page() {
    return <WireGuardGenerator />;
}
