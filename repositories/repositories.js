const octokit = require("../index");
const { sortArrayByAsc, handleNullSplit } = require("../utils");

// Lists repositories for the specified organization.
const listOrganisationRepositories = async (org) => {
    const response = await octokit.paginate(`GET /orgs/${org}/repos`);
    let result = response.map((item) => {
        const name = item.name;
        const html_url = item.html_url;
        const created_at = item.created_at.split("T")[0];
        return {
            name,
            html_url,
            created_at
        }
    })
    result = sortArrayByAsc(result, "created_at", true);
    return result;
};

// The parent and source objects are present when the repository is a fork. 
// parent is the repository this repository was forked from, source is the 
// ultimate source for the network.
const getRepository = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}`);
    console.log(response);
};

// Lists contributors to the specified repository and sorts them by the 
// number of commits per contributor in descending order.
const listRepositoryContributors = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/contributors`);
    console.log(response);
};

// Lists languages for the specified repository. The value shown for each language
// is the number of bytes of code written in that language.
const listRepositoryLanguages = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/languages`);
    console.log(response);
};

// List of Git tags
const listRepositoryTags = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/tags`);
    console.log(response);
};

const getRepositoryTeams = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/teams`);
    console.log(response);
};

const getAllRepositoryTopics = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/topics`);
    console.log(response);
};

const listForks = async (owner, repo) => {
    const response = await octokit.paginate(`GET /repos/${owner}/${repo}/forks`);
    let result = response.map((item) => {
        const created_at = item.created_at.split("T")[0];
        const owner = item.owner.login;
        const updated_at = handleNullSplit(item.updated_at);
        const pushed_at = handleNullSplit(item.pushed_at);
        const html_url = item.html_url
        const login = item.owner.login
        return {
            created_at,
            login,
            owner,
            updated_at,
            pushed_at,
        }
    });
    result = sortArrayByAsc(result, "created_at");
    return result;
};

module.exports = { 
    listOrganisationRepositories, 
    listForks, 
    getRepository,
    getAllRepositoryTopics,
    getRepositoryTeams,
    listRepositoryTags,
    listRepositoryLanguages,
    listRepositoryContributors,
};