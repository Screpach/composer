const KEY='edo31studio';
export const loadState=()=>{try{return JSON.parse(localStorage.getItem(KEY) || 'null');}catch{return null;}};
export const saveState=(v:unknown)=>localStorage.setItem(KEY, JSON.stringify(v));
