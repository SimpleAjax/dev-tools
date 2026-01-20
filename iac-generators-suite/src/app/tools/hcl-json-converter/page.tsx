import { Metadata } from 'next';
import HclJsonConverter from '@/components/tools/hcl-json-converter';

export const metadata: Metadata = {
    title: 'HCL to JSON Converter | IaC Suite',
    description: 'Convert Terraform HCL to JSON for programmatic use.',
};

export default function Page() {
    return <HclJsonConverter />;
}
