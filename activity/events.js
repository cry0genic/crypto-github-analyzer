const octokit = require("../index");

const listPublicOrganizationEvents = async (org) => {
    const response = await octokit.request(`GET /orgs/${org}/events`);
    console.log(response);
};

const listRepositoryEvents = async (owner, repo) => {
    const response = await octokit.paginate(`GET /repos/${owner}/${repo}/events`);
    console.log(response);
};

const listPublicEventsForUser = async (username) => {
    const response = await octokit.request(`GET /users/${username}/events/public`);
    console.log(response);
};

module.exports = {
    listPublicOrganizationEvents,
    listRepositoryEvents,
    listPublicEventsForUser
};