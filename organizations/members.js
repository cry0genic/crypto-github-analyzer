const octokit = require("../index");

// List all users who are members of an organization. 
const listOrganizationMembers = async (org) => {
    const response = await octokit.paginate(`GET /orgs/${org}/members`);
    let result = response.map((item) => {
        // no field about member joining date
    })
};

module.exports = {
    listOrganizationMembers,
};