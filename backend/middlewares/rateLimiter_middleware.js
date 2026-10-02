const rateLimit = require("express-rate-limit");

const postLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Too many posts. Please try again later."
    }
});

const actionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 30,
    message: {
        success: false,
        message: "Too many actions. Please try again later."
    }
});

module.exports = {
    postLimiter,
    actionLimiter
}