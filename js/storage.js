export const Storage = (() => {
    const FAVORITES_KEY = 'pixelvault_favorites';
    const THEME_KEY = 'pixelvault_theme';
    const LAST_SEARCH_KEY = 'pixelvault_last_search';
    const HISTORY_KEY = 'pixelvault_history';

    let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

    return {
        getFavorites() { return [...favorites]; },

        addFavorite(game) {
            if (favorites.some(f => f.id === game.id)) return false;
            favorites.push({
                id: game.id,
                name: game.name,
                image: game.background_image || game.image,
                released: game.released,
                rating: game.rating
            });
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            return true;
        },

        removeFavorite(id) {
            favorites = favorites.filter(f => f.id !== id);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        },

        isFavorite(id) { return favorites.some(f => f.id === id); },

        getTheme() { return localStorage.getItem(THEME_KEY) || 'light'; },
        setTheme(theme) { localStorage.setItem(THEME_KEY, theme); },

        saveLastSearch(data) {
            localStorage.setItem(LAST_SEARCH_KEY, JSON.stringify(data));
        },
        getLastSearch() {
            try {
                return JSON.parse(localStorage.getItem(LAST_SEARCH_KEY)) || null;
            } catch {
                return null;
            }
        },

        addToHistory(game) {
            let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
            history = history.filter(g => g.id !== game.id);
            history.unshift({
                id: game.id,
                name: game.name,
                image: game.background_image || game.image
            });
            history = history.slice(0, 10);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        },
        getHistory() {
            return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        }
    };
})();