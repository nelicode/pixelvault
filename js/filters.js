export class Filters {
    constructor() {
        this.genres = [];
        this.platforms = [];
        this.yearFrom = null;
        this.yearTo = null;
        this.minRating = 0;
    }

    collectFromDOM() {
        const genreCheckboxes = document.querySelectorAll(
            '.filter-group[data-filter="genre"] input[type="checkbox"]:checked'
        );
        const platformCheckboxes = document.querySelectorAll(
            '.filter-group[data-filter="platform"] input[type="checkbox"]:checked'
        );

        this.genres = Array.from(genreCheckboxes).map(cb => cb.value);
        this.platforms = Array.from(platformCheckboxes).map(cb => cb.value);

        this.yearFrom = document.querySelector('#year-from')?.value || null;
        this.yearTo = document.querySelector('#year-to')?.value || null;
        this.minRating = parseFloat(document.querySelector('#rating-min')?.value) || 0;

        return this;
    }

    toApiParams(query = '') {
        const params = {};
        if (query) params.search = query;
        if (this.genres.length) params.genres = this.genres.join(',');
        if (this.platforms.length) params.platforms = this.platforms.join(',');

        if (this.yearFrom && this.yearTo) {
            params.dates = `${this.yearFrom}-01-01,${this.yearTo}-12-31`;
        } else if (this.yearFrom) {
            params.dates = `${this.yearFrom}-01-01,${new Date().getFullYear()}-12-31`;
        } else if (this.yearTo) {
            params.dates = `1970-01-01,${this.yearTo}-12-31`;
        }

        return params;
    }

    applyRatingFilter(games) {
        if (!this.minRating) return games;
        return games.filter(g => (g.rating || 0) >= this.minRating);
    }

    reset() {
        document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        const yearFrom = document.querySelector('#year-from');
        const yearTo = document.querySelector('#year-to');
        const rating = document.querySelector('#rating-min');
        if (yearFrom) yearFrom.value = '';
        if (yearTo) yearTo.value = '';
        if (rating) rating.value = 0;

        this.genres = [];
        this.platforms = [];
        this.yearFrom = null;
        this.yearTo = null;
        this.minRating = 0;
    }
}