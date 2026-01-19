export type LockState = 'idle' | 'waiting' | 'acquired';

export interface PromptLine {
    type: 'input' | 'output' | 'error' | 'info';
    content: string;
    timestamp?: number;
}
