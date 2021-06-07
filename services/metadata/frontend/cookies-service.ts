// necessary for CookieModal to work with TS
declare global {
  interface Window {
    gtag: any;
  }
}

import {writable} from "svelte/store";

export const setCookie = (name: string, value: string, days = 90, path = '/') => {
  const domain = 'dasch.swiss';
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; domain=${domain}; expires=${expires}; path=${path}`;
};

export const getCookie = (name: string) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '');
};

const deleteCookie = (name: string, path: string) => {
  setCookie(name, '', -1, path);
};

export const cookiesAgreement = writable(getCookie('cookiesAgreement') === 'true' || false);
