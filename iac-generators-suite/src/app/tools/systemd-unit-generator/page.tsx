import { Metadata } from 'next';
import SystemdUnitGenerator from '@/components/tools/systemd-unit-generator';

export const metadata: Metadata = {
    title: 'Systemd Unit Generator | IaC Suite',
    description: 'Generate systemd service files with ease.',
};

export default function Page() {
    return <SystemdUnitGenerator />;
}
