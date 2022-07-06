const octokit = require("../index");

// This endpoint will return all community profile metrics, including an overall health score, 
// repository description, the presence of documentation, detected code of conduct, 
// detected license, and the presence of ISSUE_TEMPLATE, PULL_REQUEST_TEMPLATE, README, and 
// CONTRIBUTING files.

// The health_percentage score is defined as a percentage of how many of these 
// four documents are present: README, CONTRIBUTING, LICENSE, and CODE_OF_CONDUCT. 
// For example, if all four documents are present, then the health_percentage is 100. 
// If only one is present, then the health_percentage is 25.

// content_reports_enabled is only returned for organization-owned repositories.

const getCommunityProfileMetrics = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/community/profile`);
    console.log(response);
};

module.exports = { getCommunityProfileMetrics };