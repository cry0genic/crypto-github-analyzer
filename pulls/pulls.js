const octokit = require("../index");
const { sortArrayByAsc, handleNullSplit } = require("../utils")

const listPullRequests = async (owner, repo) => {
    const response = await octokit.paginate(`GET /repos/${owner}/${repo}/pulls`);
    let result = response.map((item) => {
        const state = item.state;
        const title = item.title;
        const user = item.user.login;
        const created_at = item.created_at.split("T")[0];
        const updated_at = handleNullSplit(item.updated_at);
        const closed_at = handleNullSplit(item.closed_at);
        const merged_at = handleNullSplit(item.merged_at);
        return {
            state,
            title,
            user,
            created_at,
            updated_at,
            closed_at,
            merged_at
        }
    })
    result = sortArrayByAsc(result, "created_at");
    return result;
};

module.exports = { listPullRequests };