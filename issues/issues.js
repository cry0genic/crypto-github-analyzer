const octokit = require("../index");
const { sortArrayByAsc, handleNullSplit } = require("../utils")

// List issues in a repository.
const listRepositoryIssues = async (owner, repo) => {
    const response = await octokit.paginate(`GET /repos/${owner}/${repo}/issues`);
    let result = response.map((item) => {
        const title = item.title;
        const created_at = item.created_at.split("T")[0];
        const closed_at = handleNullSplit(item.closed_at);
        const user = item.user.login;
        const state = item.state;
        const updated_at = handleNullSplit(item.updated_at);
        return {
            title,
            created_at,
            closed_at,
            user,
            state,
            updated_at,
        }
    });
    result = sortArrayByAsc(result, "created_at");
    return result;
};

module.exports = {
    listRepositoryIssues,
};