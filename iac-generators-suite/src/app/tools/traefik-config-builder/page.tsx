import { Metadata } from 'next';
import TraefikConfigBuilder from '@/components/tools/traefik-config-builder';

export const metadata: Metadata = {
    title: 'Traefik Config Builder | IaC Suite',
    description: 'Generate Traefik static and dynamic configuration files.',
};

export default function Page() {
    return <TraefikConfigBuilder />;
}
