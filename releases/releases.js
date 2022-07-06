const octokit = require("../index");
const { sortArrayByAsc, handleNullSplit } = require("../utils")

// This returns a list of releases, which does not include regular 
// Git tags that have not been associated with a release.
const listReleases = async (owner, repo) => {
    const response = await octokit.paginate(`GET /repos/${owner}/${repo}/releases`);
    let result = response.map((item) => {
        const author = item.author.login;
        const tag_name = item.tag_name;
        const name = item.name;
        const created_at = item.created_at.split("T")[0];
        const published_at = handleNullSplit(item.published_at);
        const html_url = item.html_url;
        return {
            author,
            tag_name,
            name,
            created_at,
            published_at,
        }
    });
    result = sortArrayByAsc(result, "published_at");
    return result;
};

// View the latest published full release for the repository.
const getLastestRelease = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/releases/latest`);
    console.log(response);
};

// Get a published release with the specified tag.
const getReleaseTagByName = async (owner, repo, tag) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/releases/tags/${tag}`);
    console.log(response);
};

module.exports = {
    listReleases,
    getLastestRelease,
    getReleaseTagByName,
};