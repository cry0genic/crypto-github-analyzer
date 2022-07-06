const octokit = require("../index");

const getOrganization = async (org) => {
    const response = await octokit.paginate(`GET /orgs/${org}`);
    console.log(response);
};

const listOrganizationsForUser = async (username) => {
    const response = await octokit.request(`GET /users/${username}/orgs`);
    console.log(response);
};

module.exports = {
    getOrganization,
    listOrganizationsForUser
};