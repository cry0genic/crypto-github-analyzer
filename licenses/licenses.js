const octokit = require("../index");

// This method returns the contents of the repository's license file, if one is detected.
const getLicenseForRepository = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/license`);
    console.log(response);
};

module.exports = {
    getLicenseForRepository,
};