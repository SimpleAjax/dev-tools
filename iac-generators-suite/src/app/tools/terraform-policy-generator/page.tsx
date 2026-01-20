import { Metadata } from 'next';
import TerraformPolicyGenerator from '@/components/tools/terraform-policy-generator';

export const metadata: Metadata = {
    title: 'Terraform Policy Generator | IaC Suite',
    description: 'Generate Sentinel or OPA (Rego) policies for Terraform.',
};

export default function Page() {
    return <TerraformPolicyGenerator />;
}
