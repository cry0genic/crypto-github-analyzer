const octokit = require("../index");

const listBranches = async (owner, repo) => {
    const response = await octokit.paginate(`GET /repos/${owner}/${repo}/branches`);
    let result = response.map((item) => {
        const name = item.name;
        const protected = item.protected;
        return {
            name,
            protected,
        }
    })
    return result;
};

module.exports = {
    listBranches,
};