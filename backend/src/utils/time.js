// utils/time.js
export const secondsFromNow = (seconds) =>
  new Date(Date.now() + seconds * 1000);
