import { PUBLIC_LANGUAGE } from '$env/static/public';
import { writable, type Writable } from 'svelte/store';

export let collectionValue: any = writable({}); // collective data of collection
export let mode: Writable<'view' | 'edit' | 'create'> = writable('view');
export let entryValue: Writable<any> = writable({});

// Store selected content language
export const language: Writable<string> = writable(PUBLIC_LANGUAGE);

// Store image data while editing
export const saveEditedImage: Writable<boolean> = writable(false);

// Store toggleLeftSidebar
export const toggleLeftSidebar: Writable<boolean> = writable(true);

// Store detault SystemLanguage
export const systemLanguage: Writable<string> = writable('en');
