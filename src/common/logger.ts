export let DEBUG = false;

export const setDebug = (state: boolean) => DEBUG = state;

export const DERROR = (msg: any) => console.error(`ERROR: ${msg}`);
export const DLOG = (msg: any) => console.log(`LOG: ${msg}`);
