const RAWG_API_KEY = 'cca7b8b33ce941d687445dafc12041d0';
const RAWG_BASE = 'https://api.rawg.io/api';
const CHEAPSHARK_BASE = 'https://www.cheapshark.com/api/1.0';

export class GameAPI {
    constructor() { this.cache = new Map(); }
    async searchGames(query, filters = {}) {
        const cacheKey = `search-${query}-${JSON.stringify(filters)}`;
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);
        const params = new URLSearchParams({ key: RAWG_API_KEY, search: query || 'elden ring', page_size: 12, ...filters });
        try {
            const response = await fetch(`${RAWG_BASE}/games?${params}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            this.cache.set(cacheKey, data.results);
            return data.results;
        } catch (error) { console.error('Error:', error); return []; }
    }
    async getGameDetails(id) {
        try {
            const response = await fetch(`${RAWG_BASE}/games/${id}?key=${RAWG_API_KEY}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) { console.error('Error:', error); return null; }
    }
    async getDeals(gameTitle) {
        try {
            const response = await fetch(`${CHEAPSHARK_BASE}/deals?title=${encodeURIComponent(gameTitle)}&limit=10`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) { console.error('Error:', error); return []; }
    }
}