
// Export the component
export { default as SureFeedback } from './surefeedback.svelte';

// Export types
export interface SureFeedbackProps {
    url: string;
    enabled?: boolean;
    debug?: boolean;
    timeout?: number;
    persistToken?: boolean;
    tokenKey?: string;
    onError?: (error: string) => void;
    onLoaded?: () => void;
}