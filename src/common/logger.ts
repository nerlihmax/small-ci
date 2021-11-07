export let DEBUG = false;

export const setDebug = (state: boolean) => DEBUG = state;

export const DERROR = (msg: string) => console.error(`ERROR: ${msg}`);
export const DLOG = (msg: string) => console.log(`LOG: ${msg}`);
