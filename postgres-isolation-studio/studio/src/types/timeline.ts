export interface TimelineEvent {
    id: string;
    timestamp: number;
    sessionName: string;
    type: 'query' | 'info' | 'error' | 'transaction';
    content: string;
    status?: 'active' | 'blocked' | 'committed' | 'rolled-back';
    duration?: number;
}
