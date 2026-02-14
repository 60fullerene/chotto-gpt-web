import { Provider } from "./types";

const STORAGE_KEY_PREFIX = "chotto-gpt-api-key-";

/**
 * Retrieve an API key from localStorage.
 * Returns an empty string if not found or if running on the server.
 */
export function getApiKey(provider: Provider): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}${provider}`) ?? "";
}

/**
 * Save an API key to localStorage.
 */
export function setApiKey(provider: Provider, key: string): void {
    if (typeof window === "undefined") return;
    if (key.trim()) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${provider}`, key.trim());
    } else {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${provider}`);
    }
}

/**
 * Check whether a key is set for a given provider.
 */
export function hasApiKey(provider: Provider): boolean {
    return getApiKey(provider).length > 0;
}
