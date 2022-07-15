require("dotenv").config();

const tokens = process.env.TOKENS.split(",");
let currentIndex = 0;

async function auth() {
    return {
        type: "token",
    };
}

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

const multiTokenAuth = function multiTokenAuth() {
    return Object.assign(auth.bind(null), {
        hook: hook.bind(null)
    });
};

exports.multiTokenAuth = multiTokenAuth;