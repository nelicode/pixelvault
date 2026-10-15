import { GameAPI } from './api.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';
import { Theme } from './theme.js';

// ✅ Placeholder para juegos sin imagen
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
    '<rect width="400" height="300" fill="#e0e0e0"/>' +
    '<text x="200" y="150" font-family="Arial, sans-serif" font-size="20" fill="#999" text-anchor="middle" dominant-baseline="middle">No Image</text>' +
    '</svg>'
);

(async () => {
    try {
        const api = new GameAPI();
        const ui = new UI();
        Theme.init();

        const path = window.location.pathname;
        const isFavorites = path.includes('favorites');
        const isDeals = path.includes('deals');

        // ============= HOME PAGE =============
        if (!isFavorites && !isDeals) {
            const games = await api.searchGames('elden ring');
            ui.renderGames(games);

            document.querySelector('#game-grid')?.addEventListener('click', async (e) => {
                const favBtn = e.target.closest('[data-action="favorite"]');
                const card = e.target.closest('.game-card');

                if (favBtn) {
                    e.stopPropagation();
                    const id = Number(favBtn.dataset.id);
                    const game = games.find(g => g.id === id);
                    if (!game) return;
                    if (Storage.isFavorite(id)) {
                        Storage.removeFavorite(id);
                        favBtn.textContent = '+ Favorite';
                        favBtn.classList.remove('saved');
                    } else {
                        Storage.addFavorite(game);
                        favBtn.textContent = '✓ Saved';
                        favBtn.classList.add('saved');
                    }
                } else if (card) {
                    const id = Number(card.dataset.gameId);
                    const details = await api.getGameDetails(id);
                    if (details) {
                        Storage.addToHistory(details);

                        const tagsHTML = details.tags?.slice(0, 8).map(t => `<span class="tag">${t.name}</span>`).join(' ') || 'N/A';
                        const genresHTML = details.genres?.map(g => g.name).join(', ') || 'N/A';
                        const platformsHTML = details.platforms?.map(p => p.platform.name).join(', ') || 'N/A';
                        const developersHTML = details.developers?.map(d => d.name).join(', ') || 'N/A';
                        const publishersHTML = details.publishers?.map(p => p.name).join(', ') || 'N/A';
                        const websiteHTML = details.website
                            ? `<a href="${details.website}" target="_blank" rel="noopener">Visit official site</a>`
                            : 'N/A';

                        const fullDescription = details.description_raw || 'No description available.';
                        const shortDescription = fullDescription.slice(0, 300);
                        const hasMore = fullDescription.length > 300;

                        // ✅ Usa imagen por defecto si no hay background_image
                        const imageSrc = details.background_image || PLACEHOLDER_IMAGE;

                        ui.showModal(`
                            <h2 id="modal-title">${details.name}</h2>
                            <img src="${imageSrc}" alt="${details.name}">
                            <p><strong>Released:</strong> ${details.released || 'N/A'}</p>
                            <p><strong>Rating:</strong> ⭐ ${details.rating || 'N/A'} / 5.0</p>
                            <p><strong>Metacritic:</strong> ${details.metacritic || 'N/A'}</p>
                            <p><strong>Playtime:</strong> ${details.playtime ? details.playtime + ' hours' : 'N/A'}</p>
                            <p><strong>Genres:</strong> ${genresHTML}</p>
                            <p><strong>Platforms:</strong> ${platformsHTML}</p>
                            <p><strong>Developer:</strong> ${developersHTML}</p>
                            <p><strong>Publisher:</strong> ${publishersHTML}</p>
                            <p><strong>Tags:</strong> ${tagsHTML}</p>
                            <p><strong>Website:</strong> ${websiteHTML}</p>
                            <div style="margin-top: 1rem;">
                                <p id="modal-description">${shortDescription}${hasMore ? '...' : ''}</p>
                                ${hasMore ? '<button class="btn-link" id="read-more-btn" style="color: var(--accent-primary); font-weight: 600; padding: 0.5rem 0; background: none; border: none; cursor: pointer;">Read more ↓</button>' : ''}
                            </div>
                            <button class="btn-primary" id="view-deals-btn" data-name="${details.name}" style="margin-top: 1rem;">Compare Prices</button>
                        `);

                        const readMoreBtn = document.querySelector('#read-more-btn');
                        readMoreBtn?.addEventListener('click', () => {
                            const desc = document.querySelector('#modal-description');
                            if (desc) {
                                const isExpanded = desc.dataset.expanded === 'true';
                                if (isExpanded) {
                                    desc.textContent = shortDescription + '...';
                                    readMoreBtn.textContent = 'Read more ↓';
                                } else {
                                    desc.textContent = fullDescription;
                                    readMoreBtn.textContent = 'Read less ↑';
                                }
                                desc.dataset.expanded = isExpanded ? 'false' : 'true';
                            }
                        });

                        document.querySelector('#view-deals-btn')?.addEventListener('click', () => {
                            window.location.href = `deals.html?game=${encodeURIComponent(details.name)}`;
                        });
                    }
                }
            });

            let searchTimeout;
            document.querySelector('#search-input')?.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(async () => {
                    const query = e.target.value.trim();
                    if (query.length < 2) return;
                    const results = await api.searchGames(query);
                    ui.renderGames(results);
                }, 500);
            });

            document.querySelector('#surprise-btn')?.addEventListener('click', async () => {
                const random = await api.searchGames('');
                if (random.length > 0) {
                    const pick = random[Math.floor(Math.random() * random.length)];
                    const details = await api.getGameDetails(pick.id);
                    if (details) {
                        Storage.addToHistory(details);

                        const tagsHTML = details.tags?.slice(0, 8).map(t => `<span class="tag">${t.name}</span>`).join(' ') || 'N/A';
                        const genresHTML = details.genres?.map(g => g.name).join(', ') || 'N/A';
                        const platformsHTML = details.platforms?.map(p => p.platform.name).join(', ') || 'N/A';

                        const imageSrc = details.background_image || PLACEHOLDER_IMAGE;

                        ui.showModal(`
                            <h2 id="modal-title">🎲 Surprise: ${details.name}</h2>
                            <img src="${imageSrc}" alt="${details.name}">
                            <p><strong>Released:</strong> ${details.released || 'N/A'}</p>
                            <p><strong>Rating:</strong> ⭐ ${details.rating || 'N/A'} / 5.0</p>
                            <p><strong>Genres:</strong> ${genresHTML}</p>
                            <p><strong>Platforms:</strong> ${platformsHTML}</p>
                            <p><strong>Tags:</strong> ${tagsHTML}</p>
                            <p style="margin-top: 1rem;">${(details.description_raw || '').slice(0, 500)}...</p>
                        `);
                    }
                }
            });

            // ✅ FILTROS CORREGIDOS — usan data-filter del HTML
            document.querySelector('#apply-filters')?.addEventListener('click', async () => {
                const genreChecked = document.querySelectorAll(
                    '.filter-group[data-filter="genre"] input[type="checkbox"]:checked'
                );
                const platformChecked = document.querySelectorAll(
                    '.filter-group[data-filter="platform"] input[type="checkbox"]:checked'
                );

                const genreIds = Array.from(genreChecked).map(cb => cb.value).join(',');
                const platformIds = Array.from(platformChecked).map(cb => cb.value).join(',');

                const yearFrom = document.querySelector('#year-from')?.value;
                const yearTo = document.querySelector('#year-to')?.value;
                const minRating = parseFloat(document.querySelector('#rating-min')?.value) || 0;

                const query = document.querySelector('#search-input')?.value || '';
                const filters = {};

                if (genreIds) filters.genres = genreIds;
                if (platformIds) filters.platforms = platformIds;

                if (yearFrom && yearTo) {
                    filters.dates = `${yearFrom}-01-01,${yearTo}-12-31`;
                } else if (yearFrom) {
                    filters.dates = `${yearFrom}-01-01,${new Date().getFullYear()}-12-31`;
                } else if (yearTo) {
                    filters.dates = `1970-01-01,${yearTo}-12-31`;
                }

                Storage.saveLastSearch({ query, filters, timestamp: Date.now() });

                const results = await api.searchGames(query, filters);
                const filtered = results.filter(g => (g.rating || 0) >= minRating);
                ui.renderGames(filtered);
            });

            document.querySelector('#rating-min')?.addEventListener('input', (e) => {
                const span = document.querySelector('#rating-value');
                if (span) span.textContent = parseFloat(e.target.value).toFixed(1);
            });

            const lastSearch = Storage.getLastSearch();
            if (lastSearch && lastSearch.query) {
                const searchInput = document.querySelector('#search-input');
                if (searchInput) searchInput.value = lastSearch.query;
            }
        }

        // ============= FAVORITES PAGE =============
        if (isFavorites) {
            ui.renderFavorites();

            document.querySelector('#favorites-list')?.addEventListener('click', (e) => {
                const favBtn = e.target.closest('[data-action="favorite"]');
                if (favBtn) {
                    e.stopPropagation();
                    const id = Number(favBtn.dataset.id);
                    Storage.removeFavorite(id);
                    ui.renderFavorites();
                }
            });
        }

        // ============= DEALS PAGE =============
        if (isDeals) {
            const params = new URLSearchParams(window.location.search);
            const gameParam = params.get('game');
            const dealSearchInput = document.querySelector('#deal-search');

            if (gameParam && dealSearchInput) {
                dealSearchInput.value = gameParam;
                const deals = await api.getDeals(gameParam);
                ui.renderDeals(deals, gameParam);
            }

            document.querySelector('#deal-search-btn')?.addEventListener('click', async () => {
                const title = dealSearchInput?.value.trim();
                if (!title) return;
                const deals = await api.getDeals(title);
                ui.renderDeals(deals, title);
            });
        }

        // ============= COMMON =============
        document.querySelector('.modal-close')?.addEventListener('click', () => ui.hideModal());
        document.querySelector('#modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal') ui.hideModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') ui.hideModal();
        });

        document.querySelector('#menu-toggle')?.addEventListener('click', (e) => {
            const nav = document.querySelector('#main-nav');
            const isOpen = nav?.classList.toggle('open');
            e.currentTarget.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

    } catch (error) {
        console.error('Application error:', error);
    }
})();