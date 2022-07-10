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

const fileMap = {
    stars: "STARS.json",
    watch: "WATCH-LIST.json",
    issues: "ISSUES.json",
    weeklyCommitActivity: "WEEKLY-COMMIT-ACTIVITY.json",
    lastYearCommitActivity: "LAST-YEAR-COMMIT-ACTIVITY.json",
    allContributorCommitActivity: "ALL-CONTRIBUTOR-COMMIT-ACTVITY.json",
    pullRequests: "PULL-REQUESTS.json",
    releases: "RELEASES.json",
    forks: "FORKS.json",
    languages: "LANGUAGES.json",
    contributors: "CONTRIBUTORS.json",
};

module.exports = { fileMap, fetcherMap };