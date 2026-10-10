import { Storage } from './storage.js';
export class UI {
    constructor() {
        this.grid = document.querySelector('#game-grid') || document.querySelector('#favorites-list');
        this.modal = document.querySelector('#modal');
        this.modalBody = document.querySelector('#modal-body');
    }
    renderGames(games) {
        if (!this.grid) return;
        this.grid.innerHTML = '';
        if (!games || games.length === 0) { this.grid.innerHTML = '<p>No games found.</p>'; return; }
        const fragment = document.createDocumentFragment();
        games.forEach(game => fragment.appendChild(this.createGameCard(game)));
        this.grid.appendChild(fragment);
    }
    createGameCard(game) {
        const card = document.createElement('article');
        card.className = 'game-card';
        card.dataset.gameId = game.id;
        const year = game.released ? game.released.slice(0, 4) : 'N/A';
        const rating = game.rating ? game.rating.toFixed(1) : 'N/A';
        const isFav = Storage.isFavorite(game.id);
        card.innerHTML = `
      <img src="${game.background_image || ''}" alt="${game.name}" loading="lazy">
      <h3>${game.name} (${year})</h3>
      <p>Rating: ⭐ ${rating} / 5.0</p>
      <button class="favorite-btn ${isFav ? 'saved' : ''}" data-id="${game.id}">${isFav ? '✓ Saved' : '+ Favorite'}</button>
    `;
        return card;
    }
    showModal(content) { this.modalBody.innerHTML = content; this.modal.classList.remove('hidden'); }
    hideModal() { this.modal.classList.add('hidden'); }
}