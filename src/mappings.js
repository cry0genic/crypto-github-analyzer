const { octokit } = require("./fetchers/octokit");

const fetcherMap = (method) => {
    switch (method) {
        case "bigQuery":
            return {
                // stars: bigQuery.stars,
            };
        case "octokit":
            return {
                stars: octokit.listStargazers,
                watchers: octokit.listWatchers,
                branches: octokit.listBranches,
                issues: octokit.listRepositoryIssues,
                weeklyCommitActivity: octokit.getWeeklyCommitActivity,
                lastYearCommitActivity: octokit.getLastYearCommitActivity,
                allContributorCommitActivity: octokit.getAllContributorCommitActivity,
                pullRequests: octokit.listPullRequests,
                releases: octokit.listReleases,
                listOrganisationRepositories: octokit.listOrganisationRepositories,
                contributors: octokit.listRepositoryContributors,
                forks: octokit.listForks,
                languages: octokit.listRepositoryLanguages
            };
    }
};

module.exports = { fetcherMap };