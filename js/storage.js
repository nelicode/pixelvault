export const Storage = (() => {
    const FAVORITES_KEY = 'pixelvault_favorites';
    const THEME_KEY = 'pixelvault_theme';
    let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    return {
        getFavorites() { return [...favorites]; },
        addFavorite(game) {
            if (favorites.some(f => f.id === game.id)) return false;
            favorites.push({ id: game.id, name: game.name, image: game.background_image, released: game.released, rating: game.rating });
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            return true;
        },
        removeFavorite(id) { favorites = favorites.filter(f => f.id !== id); localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); },
        isFavorite(id) { return favorites.some(f => f.id === id); },
        getTheme() { return localStorage.getItem(THEME_KEY) || 'light'; },
        setTheme(theme) { localStorage.setItem(THEME_KEY, theme); }
    };
})();