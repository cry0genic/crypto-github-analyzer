'use strict';
require("dotenv").config()

Object.defineProperty(exports, '__esModule', { value: true });

// [yadu sir, aditya, madhav, subhramit, cc, orchid, hitansh, harsh, harshRathi, samriddha, dhruv]
const tokens = [
    process.env.YADU,
    process.env.ADITYA,
    process.env.MADHAV,
    process.env.BASU,
    process.env.SHIRSH,
    process.env.ORCHID,
    process.env.HITANSH,
    process.env.HARSHJR,
    process.env.HARSHSR,
    process.env.SAMRIDDHA,
    process.env.DHRUV
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