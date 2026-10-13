export function truncate(text, maxLength = 100) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export function formatYear(dateString) {
    if (!dateString) return 'N/A';
    return dateString.slice(0, 4);
}

export function formatRating(rating) {
    if (!rating) return 'N/A';
    return Number(rating).toFixed(1);
}

export function formatPrice(price) {
    if (!price) return 'N/A';
    return `$${Number(price).toFixed(2)}`;
}

export function formatDiscount(savings) {
    if (!savings) return '0% OFF';
    return `${Math.round(savings)}% OFF`;
}

export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function debounce(fn, delay = 300) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}