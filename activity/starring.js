const octokit = require("../index");
const { sortArrayByAsc, handleNullSplit } = require("../utils")

const listStargazers = async (owner, repo) => {
    const response = await octokit.paginate(`GET /repos/${owner}/${repo}/stargazers`, {
        headers: {
            "accept": "application/vnd.github.v3.star+json",
        },
        per_page: 100,
    });
    let result = response.map((item) => {
        const date = handleNullSplit(item.starred_at);
        const user = item.user.html_url;
        return {
            date,
            user
        }
    });
    result = sortArrayByAsc(result, "date");
    return result;
};

const listRepositoriesStarredByUser = async (username) => {
    const response = await octokit.request(`GET /users/${username}/starred`);
    console.log(response);
};

module.exports = {
    listStargazers,
    listRepositoriesStarredByUser,
};