import { GameAPI } from './api.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';
import { Theme } from './theme.js';

(async () => {
    const api = new GameAPI();
    const ui = new UI();
    Theme.init();

    const initialGames = await api.searchGames('elden ring');
    ui.renderGames(initialGames);

    document.querySelector('#game-grid')?.addEventListener('click', async (e) => {
        const favBtn = e.target.closest('.favorite-btn');
        const card = e.target.closest('.game-card');
        if (favBtn) {
            e.stopPropagation();
            const id = Number(favBtn.dataset.id);
            const game = initialGames.find(g => g.id === id) || { id };
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
          <img src="${details.background_image || ''}" alt="${details.name}" style="width:100%;border-radius:8px;">
          <p style="margin-top:1rem;">${(details.description_raw || '').slice(0, 400)}...</p>
          <p><strong>Developer:</strong> ${details.developers?.map(d => d.name).join(', ') || 'N/A'}</p>
          <p><strong>Metacritic:</strong> ${details.metacritic || 'N/A'}</p>
        `);
            }
        }
    });

    document.querySelector('.modal-close')?.addEventListener('click', () => ui.hideModal());
    document.querySelector('#modal')?.addEventListener('click', (e) => { if (e.target.id === 'modal') ui.hideModal(); });
    document.querySelector('#search-input')?.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length < 3) return;
        const games = await api.searchGames(query);
        ui.renderGames(games);
    });
    document.querySelector('#menu-toggle')?.addEventListener('click', () => {
        document.querySelector('#filters')?.classList.toggle('active');
    });
})();