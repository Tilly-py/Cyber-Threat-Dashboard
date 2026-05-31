export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export type CveItem = {
    id: string;
    description: string;
    published: string;
    lastModified: string;
    severity: Severity;
    score: number | null;
    refrences: string[];
};