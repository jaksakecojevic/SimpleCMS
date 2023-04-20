import { PUBLIC_LANGUAGE } from '$env/static/public';
import collections from '@src/collections';
import { setLocale } from '@src/i18n/i18n-svelte';
import type { Locales } from '@src/i18n/i18n-types';
import { loadAllLocales } from '@src/i18n/i18n-util.sync';
import { writable, type Writable } from 'svelte/store';

// Create a writable store for credentials with initial value from local storage
export let credentials: Writable<{ username: string; session: string }> = writable(
	JSON.parse(window.localStorage.getItem('credentials') || '{"username":null,"session":null}')
);

// Create a writable store for systemLanguage with initial value of PUBLIC_LANGUAGE
export let systemLanguage: Writable<string> = writable(PUBLIC_LANGUAGE);

// Subscribe to changes in credentials store and update local storage accordingly
credentials.subscribe((val) => {
	window.localStorage.setItem('credentials', JSON.stringify(val));
});

// Load all locales
loadAllLocales();

// Subscribe to changes in systemLanguage store and set locale accordingly
systemLanguage.subscribe((val) => {
	setLocale(val as Locales);
});

// Create a writable store for current collection with initial value of first collection
export let collection = writable(collections[0]); // current collection
