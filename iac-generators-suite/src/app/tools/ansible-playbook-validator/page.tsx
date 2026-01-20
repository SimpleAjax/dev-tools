import { Metadata } from 'next';
import AnsibleValidator from '@/components/tools/ansible-playbook-validator';

export const metadata: Metadata = {
  title: 'Ansible Playbook Validator | IaC Suite',
  description: 'Validate and lint your Ansible Playbooks.',
};

export default function Page() {
  return <AnsibleValidator />;
}
