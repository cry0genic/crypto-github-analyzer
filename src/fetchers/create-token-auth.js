'use strict';
require("dotenv").config()

Object.defineProperty(exports, '__esModule', { value: true });

const tokens = process.env.TOKENS.split(", ")
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