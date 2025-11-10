export const now = () => new Date();

export const inWindow = (start, windowSec) =>
  start && (Date.now() - new Date(start).getTime()) < windowSec * 1000;

export const secondsLeft = (until) =>
  until ? Math.max(0, Math.ceil((new Date(until).getTime() - Date.now())/1000)) : 0;

export const cfg = {
  validity:           Number(process.env.OTP_VALIDITY_SECONDS || 300),  // 5m
  sendWindowSec:      Number(process.env.OTP_SEND_WINDOW_SECONDS || 300),
  maxSends:           Number(process.env.OTP_MAX_SENDS_PER_WINDOW || 5),
  failWindowSec:      Number(process.env.OTP_FAIL_WINDOW_SECONDS || 900), // 15m
  maxFails:           Number(process.env.OTP_MAX_FAILS_PER_WINDOW || 5),
  lockMinutes:        Number(process.env.OTP_LOCK_MINUTES || 15),
};
