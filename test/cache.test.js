const tap = require('tap');
const cacheService = require('../src/services/cache.service');

tap.test('Cache Service - Key Generation', (t) => {
    // 1. Same preferences in different order should yield identical keys
    const key1 = cacheService.generateKey(['movies', 'comics']);
    const key2 = cacheService.generateKey(['comics', 'movies']);
    t.equal(key1, key2, 'Alphabetical sorting should result in the same key for identical sets');
    
    // 2. Extra spaces and different casings should yield identical keys
    const key3 = cacheService.generateKey([' Movies ', 'CoMiCs']);
    t.equal(key1, key3, 'Trimming and lowercasing should result in the same key');
    
    // 3. Different preferences should yield different keys
    const key4 = cacheService.generateKey(['sports']);
    t.not(key1, key4, 'Different preferences should result in different keys');

    // 4. Empty preferences should yield a default key
    const key5 = cacheService.generateKey([]);
    const key6 = cacheService.generateKey(null);
    t.equal(key5, 'pref_default', 'Empty preferences should return the default key');
    t.equal(key6, 'pref_default', 'Null preferences should return the default key');

    t.end();
});

tap.test('Cache Service - Set, Get and Clear', (t) => {
    cacheService.clear();

    const testKey = 'test_key';
    const testData = { articles: ['a', 'b'] };

    // 1. Get before set (cache miss)
    t.equal(cacheService.get(testKey), null, 'Cache miss should return null');

    // 2. Set then get (cache hit)
    cacheService.set(testKey, testData, 10);
    t.same(cacheService.get(testKey), testData, 'Cache hit should return stored data');

    // 3. Clear cache
    cacheService.clear();
    t.equal(cacheService.get(testKey), null, 'Cache get after clear should return null');

    t.end();
});

tap.test('Cache Service - Expiration', async (t) => {
    cacheService.clear();

    const testKey = 'expiry_key';
    const testData = 'expired_data';

    // Set item with 1 second TTL
    cacheService.set(testKey, testData, 1);
    t.equal(cacheService.get(testKey), testData, 'Cache should return data immediately after setting');

    // Wait for 1.1 seconds to expire the cache entry
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Get after expiration (should yield null)
    t.equal(cacheService.get(testKey), null, 'Cache should return null after entry has expired');
    t.end();
});
