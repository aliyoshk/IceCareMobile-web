// sessionManager.js
import { useUserStore } from '@/presentation/store/userStore';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
let timeout;

export const startSessionTimer = () => {
    resetSessionTimer();
    window.addEventListener('mousemove', resetSessionTimer);
    window.addEventListener('keydown', resetSessionTimer);
};

export const resetSessionTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const userStore = useUserStore();
        userStore.logout();
        // Optionally, redirect to login page
        window.location.href = '/login';
    }, SESSION_TIMEOUT);
};

export const stopSessionTimer = () => {
    clearTimeout(timeout);
    window.removeEventListener('mousemove', resetSessionTimer);
    window.removeEventListener('keydown', resetSessionTimer);
};
