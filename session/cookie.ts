import Cookies from 'js-cookie'
import { SessionInterface } from './session.interface';

// TO-DO: get session from supported devices e.g. WalletConnect, Ledger etc

const sessionCookieKey = 'stc-session'
export const getSessionFromCookie = () => {
    const cookie = Cookies.get(sessionCookieKey);
    if (!cookie) {
        return;
    }

    try {
        const session = JSON.parse(cookie) as SessionInterface;
        return session;
    } catch (e) {
        console.log(e);
    }
};

export const setSessionCookie = (session: any) => {
    // Omit 'expires', should linger for this session only
    Cookies.set(sessionCookieKey, JSON.stringify(session));
};

export const removeSessionCookie = () => Cookies.remove(sessionCookieKey);