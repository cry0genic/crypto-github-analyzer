const octokit = require("../index");

const listWatchers = async (owner, repo) => {
    const response = await octokit.paginate(`GET /repos/${owner}/${repo}/subscribers`);
    let result = response.map((item) => {
        const watcher = item.html_url
        return {
            watcher
        };
    });
    return result;
};

const listRepositoriesWatchedByUser = async (username) => {
    const response = await octokit.request(`GET /users/${username}/subscriptions`);
};

module.exports = {
    listWatchers,
    listRepositoriesWatchedByUser,
};