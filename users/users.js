const octokit = require("../index");

const getUser = async (username) => {
    const response = await octokit.request(`GET /users/${username}`);
    console.log(response);
};

module.exports = {
    getUser
};