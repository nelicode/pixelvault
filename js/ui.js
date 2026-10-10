import { Storage } from './storage.js';

const STORE_NAMES = {
    1: 'Steam',
    2: 'GamersGate',
    3: 'GreenManGaming',
    4: 'Amazon',
    5: 'GameStop',
    6: 'Direct2Drive',
    7: 'GOG',
    8: 'Origin',
    9: 'GamersGate',
    10: 'GameStop',
    11: 'Humble Store',
    12: 'IndieGala',
    13: 'Uplay',
    14: 'Fanatical',
    15: 'Gamesplanet',
    16: 'Gamesload',
    17: 'Gametap',
    18: 'GameStop',
    19: 'GameStop',
    20: 'GameStop',
    21: 'WinGameStore',
    22: 'GameBillet',
    23: 'GameBillet',
    24: 'Voidu',
    25: 'Epic Games',
    26: 'Gamesplanet',
    27: 'Gamesplanet',
    28: 'Gamesload',
    29: '2Game',
    30: 'IndieGala',
    31: 'Blizzard',
    32: 'AllYouPlay',
    33: 'DLGamer',
    34: 'Noctre',
    35: 'DreamGame',
    36: 'Gamesplanet',
    37: 'GameStop'
};

export class UI {
    constructor() {
        this.grid = document.querySelector('#game-grid') || document.querySelector('#favorites-list');
        this.modal = document.querySelector('#modal');
        this.modalBody = document.querySelector('#modal-body');
        this.dealsTable = document.querySelector('#deals-table');
    }

    renderGames(games) {
        if (!this.grid) return;
        this.grid.innerHTML = '';

        if (!games || games.length === 0) {
            this.grid.innerHTML = '<p class="no-results">No games found. Try another search.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        games.forEach(game => fragment.appendChild(this.createGameCard(game)));
        this.grid.appendChild(fragment);
    }

    createGameCard(game) {
        const card = document.createElement('article');
        card.className = 'game-card';
        card.dataset.gameId = game.id;
        card.dataset.gameName = game.name;

        const year = game.released ? game.released.slice(0, 4) : 'N/A';
        const rating = game.rating ? game.rating.toFixed(1) : 'N/A';
        const isFav = Storage.isFavorite(game.id);

        card.innerHTML = `
      <img src="${game.background_image || ''}" alt="${game.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
      <h3>${game.name} (${year})</h3>
      <p>Rating: ⭐ ${rating} / 5.0</p>
      <button class="favorite-btn ${isFav ? 'saved' : ''}" data-id="${game.id}" data-action="favorite">
        ${isFav ? '✓ Saved' : '+ Favorite'}
      </button>
    `;
        return card;
    }

    showModal(content) {
        if (!this.modal || !this.modalBody) return;
        this.modalBody.innerHTML = content;
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        if (!this.modal) return;
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    renderDeals(deals, gameName) {
        if (!this.dealsTable) return;

        if (!deals || deals.length === 0) {
            this.dealsTable.innerHTML = `<p class="no-results">No deals found for "${gameName}".</p>`;
            return;
        }

        const rows = deals.map(deal => `
      <tr>
        <td>${STORE_NAMES[deal.storeID] || `Store ${deal.storeID}`}</td>
        <td>$${deal.normalPrice}</td>
        <td><strong>$${deal.salePrice}</strong></td>
        <td><span class="discount-badge">${Math.round(deal.savings)}% OFF</span></td>
        <td>⭐ ${deal.dealRating ? Number(deal.dealRating).toFixed(1) : 'N/A'}</td>
      </tr>
    `).join('');

        this.dealsTable.innerHTML = `
      <h3 style="margin-bottom: 1rem;">Deals for "${gameName}"</h3>
      <table class="deals-table">
        <thead>
          <tr>
            <th>Store</th>
            <th>Normal Price</th>
            <th>Sale Price</th>
            <th>Discount</th>
            <th>Deal Rating</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    }

    renderFavorites() {
        const favorites = Storage.getFavorites();
        if (!this.grid) return;

        if (favorites.length === 0) {
            this.grid.innerHTML = '<p class="no-results">You have no favorite games yet. Go to Home and add some!</p>';
            return;
        }

        this.grid.innerHTML = '';
        const fragment = document.createDocumentFragment();
        favorites.forEach(game => fragment.appendChild(this.createGameCard(game)));
        this.grid.appendChild(fragment);
    }
}