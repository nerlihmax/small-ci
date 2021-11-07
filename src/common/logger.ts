export let DEBUG = false;

export const setDebug = (state: boolean) => DEBUG = state;

export const DERROR = (msg: any) => DEBUG && console.error(msg);
export const DLOG = (msg: any) => DEBUG && console.dir(msg);
