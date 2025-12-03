import rateLimit from "express-rate-limit";

/* ------------------------
   GENERAL API LIMIT
------------------------- */

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                 // 100 requests per IP
    message: {
        success: false,
        message: "Too many requests, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});


/* ------------------------
   AUTH / OTP STRICT LIMIT
------------------------- */

export const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,   // 10 minutes
    max: 5,                    // 5 attempts only
    message: {
        success: false,
        message: "Too many attempts. Please try again after 10 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
