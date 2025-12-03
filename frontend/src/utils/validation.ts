export const sanitize = (val: string) =>
    val.replace(/</g, "").replace(/>/g, "");

export const isEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

export const minLen = (val: string, len = 6) =>
    val.length >= len;

export const isOTP = (val: string) =>
    /^\d{6}$/.test(val);
