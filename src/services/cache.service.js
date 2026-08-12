/**
 * In-memory cache storage.
 */
class CacheService {
    constructor() {
        this.cache = {};
    }

    /**
     * Generates a deterministic cache key from search preferences.
     * Sorts elements alphabetically to ensure identical preference arrays mapped in different orders
     * generate the same cache key.
     * @param {Array<string>} preferences 
     * @returns {string} Unique cache key
     */
    generateKey(preferences = []) {
        const array = Array.isArray(preferences) ? preferences : [];
        const sorted = array
            .map(p => String(p).trim().toLowerCase())
            .filter(Boolean)
            .sort();
            
        return sorted.length > 0 ? `pref_${sorted.join('_')}` : 'pref_default';
    }

    /**
     * Fetches valid cached data. If the cache entry has expired, it is deleted and returns null.
     * @param {string} key 
     * @returns {*} The cached payload, or null if missing/expired.
     */
    get(key) {
        const entry = this.cache[key];
        if (!entry) {
            return null;
        }

        // Evict if expired
        if (Date.now() > entry.expiry) {
            delete this.cache[key];
            return null;
        }

        return entry.data;
    }

    /**
     * Caches data with an expiration limit.
     * @param {string} key - Cache key.
     * @param {*} data - Payload to cache.
     * @param {number} ttlInSeconds - Duration before expiration in seconds.
     */
    set(key, data, ttlInSeconds) {
        const expiry = Date.now() + (ttlInSeconds * 1000);
        this.cache[key] = {
            data,
            expiry
        };
    }

    /**
     * Clears all cached items (helpful for testing cache misses and hits).
     */
    clear() {
        this.cache = {};
    }
}

module.exports = new CacheService();
