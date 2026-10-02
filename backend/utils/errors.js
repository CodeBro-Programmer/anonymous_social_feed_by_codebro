class badRequestError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
    };
}


class notFoundError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
    };
};

class conflictError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
    };
}


class authorizationError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
    };
}



module.exports = {
    badRequestError,
    notFoundError,
    conflictError,
    authorizationError
}