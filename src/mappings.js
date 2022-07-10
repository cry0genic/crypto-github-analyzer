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
    stars: "STARS.csv",
    watch: "WATCH-LIST.csv",
    issues: "ISSUES.csv",
    weeklyCommitActivity: "WEEKLY-COMMIT-ACTIVITY.csv",
    lastYearCommitActivity: "LAST-YEAR-COMMIT-ACTIVITY.csv",
    allContributorCommitActivity: "ALL-CONTRIBUTOR-COMMIT-ACTVITY.jsocsvn",
    pullRequests: "PULL-REQUESTS.csv",
    releases: "RELEASES.csv",
    forks: "FORKS.csv",
    languages: "LANGUAGES.csv",
    contributors: "CONTRIBUTORS.csv",
};

module.exports = { fileMap, fetcherMap };