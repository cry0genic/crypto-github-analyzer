'use strict';
require("dotenv").config()

Object.defineProperty(exports, '__esModule', { value: true });

const tokens = [
    process.env.KEY1,
    process.env.KEY2,
    process.env.KEY3,
    process.env.KEY4,
    process.env.KEY5,
    process.env.KEY6,
    process.env.KEY7,
    process.env.KEY8,
    process.env.KEY9,
    process.env.KEY10,
    process.env.KEY11,
    process.env.KEY12,
    process.env.KEY13,
];
let currentToken = "";
let currentIndex = 0;

async function auth() {
    return {
        type: "token",
    };
}

/**
 * Prefix token for usage in the Authorization header
 * 
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix() {
    const choice = tokens[currentIndex];
    currentIndex = (currentIndex + 1) % tokens.length;
    currentToken = choice;

    return `token ${choice}`;
}


async function hook(request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    endpoint.headers.authorization = withAuthorizationPrefix();
    return request(endpoint);
}

const createTokenAuth = function createTokenAuth() {
    return Object.assign(auth.bind(null), {
        hook: hook.bind(null)
    });
};

exports.createTokenAuth = createTokenAuth;