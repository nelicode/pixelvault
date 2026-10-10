import { GameAPI } from './api.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';
import { Theme } from './theme.js';

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
                    const game = games.find(g => g.id === id) || { id };
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
                        ui.showModal(`
              <h2 id="modal-title">${details.name}</h2>
              <img src="${details.background_image || ''}" alt="${details.name}">
              <p><strong>Released:</strong> ${details.released || 'N/A'}</p>
              <p><strong>Rating:</strong> ⭐ ${details.rating || 'N/A'} / 5.0</p>
              <p><strong>Metacritic:</strong> ${details.metacritic || 'N/A'}</p>
              <p><strong>Developer:</strong> ${details.developers?.map(d => d.name).join(', ') || 'N/A'}</p>
              <p><strong>Publisher:</strong> ${details.publishers?.map(p => p.name).join(', ') || 'N/A'}</p>
              <p>${(details.description_raw || 'No description available.').slice(0, 500)}...</p>
              <button class="btn-primary" id="view-deals-btn" data-name="${details.name}">Compare Prices</button>
            `);

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
                        ui.showModal(`
              <h2 id="modal-title">🎲 Surprise: ${details.name}</h2>
              <img src="${details.background_image || ''}" alt="${details.name}">
              <p><strong>Released:</strong> ${details.released || 'N/A'}</p>
              <p><strong>Rating:</strong> ⭐ ${details.rating || 'N/A'} / 5.0</p>
              <p>${(details.description_raw || '').slice(0, 500)}...</p>
            `);
                    }
                }
            });

            document.querySelector('#apply-filters')?.addEventListener('click', async () => {
                const genres = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:checked'))
                    .map(cb => cb.value);
                const query = document.querySelector('#search-input')?.value || '';
                const results = await api.searchGames(query, { genres: genres.join(',') });
                ui.renderGames(results);
            });
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

        document.querySelector('#menu-toggle')?.addEventListener('click', () => {
            document.querySelector('#main-nav')?.classList.toggle('open');
        });
    } catch (error) {
        console.error('Application error:', error);
    }
})();