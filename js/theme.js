import { Storage } from './storage.js';
export const Theme = {
    init() {
        const saved = Storage.getTheme();
        document.body.classList.toggle('dark', saved === 'dark');
        this.updateButton(saved);
        document.querySelector('#theme-toggle')?.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark');
            Storage.setTheme(isDark ? 'dark' : 'light');
            this.updateButton(isDark ? 'dark' : 'light');
        });
    },
    updateButton(theme) {
        const btn = document.querySelector('#theme-toggle');
        if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
};