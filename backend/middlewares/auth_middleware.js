const crypto = require("crypto");

const ensureAnonymousId = (req, res, next) => {

    let anonymousId = req.cookies.anonymous_id;

    if (!anonymousId) {
        anonymousId = crypto.randomUUID();

        res.cookie("anonymous_id", anonymousId, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });
    }

    req.anonymousId = anonymousId;

    next();
};

module.exports = {
    ensureAnonymousId
};