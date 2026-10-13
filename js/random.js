export class RandomPicker {
    constructor(api) {
        this.api = api;
    }

    // Selecciona un juego aleatorio basado en los filtros activos
    async getRandomGame(filters = {}) {
        const results = await this.api.searchGames('', filters);
        if (!results || results.length === 0) return null;

        // Filtro adicional por rating
        const minRating = filters.minRating || 0;
        const candidates = minRating
            ? results.filter(g => (g.rating || 0) >= minRating)
            : results;

        const pool = candidates.length > 0 ? candidates : results;
        return pool[Math.floor(Math.random() * pool.length)];
    }
}