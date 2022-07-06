const octokit = require("./index");
const fs = require("fs");
// imports
const {
    getAllContributorCommitActivity,
    getHourlyCommitCountForEachDay,
    getLastYearCommitActivity,
    getWeeklyCommitActivity,
    getWeeklyCommitCount,
} = require("./metrics/statistics");

const { listBranches } = require("./branches/branches");

const { listRepositoryIssues } = require("./issues/issues");

const { listReleases } = require("./releases/releases");

const { listPublicOrganizationEvents,
    listRepositoryEvents,
} = require("./activity/events")

const { listOrganizationMembers } = require("./organizations/members");

const { listOrganisationRepositories,
    listForks,
    getRepository,
    getAllRepositoryTopics,
    getRepositoryTeams,
    listRepositoryTags,
    listRepositoryLanguages,
    listRepositoryContributors
} = require("./repositories/repositories");

const { listStargazers } = require("./activity/starring")

const { listWatchers } = require("./activity/watching");

const { listPullRequests } = require("./pulls/pulls")

const { arrayToFile, sortArrayByAsc } = require("./utils");

// constants
const POLYGON_OWNER = "maticnetwork";

const getAllRepositoryAnalyticsForOrganization = async (org) => {
    const response = await octokit.paginate(`GET /orgs/${org}/repos`);
    let result = response.map((item) => {
        const name = item.name;
        return {
            name
        }
    })
    for (let i = 0; i < result.length; i++) {
        const repoName = result[i].name;
        fs.mkdir(`./files/${org}/${repoName}`, { recursive: true }, (err) => {
            if (err) return console.log(err, repoName);
        });
    }
    for (let i = 0; i < result.length; i++) {
        const repoName = result[i].name;
        arrayToFile(await listWatchers(org, repoName), `./files/${org}/${repoName}/WATCH-LIST.json`);
        arrayToFile(await listBranches(org, repoName), `./files/${org}/${repoName}/BRANCH-LIST.json`);

        let stars = await listStargazers(org, repoName);
        let issues = await listRepositoryIssues(org, repoName);
        let weeklyCommitActivity = await getWeeklyCommitActivity(org, repoName)
        let lastYearCommitActivity = await getLastYearCommitActivity(org, repoName)
        let allContributorCommitActivity = await getAllContributorCommitActivity(org, repoName);
        let pullRequests = await listPullRequests(org, repoName);
        let releases = await listReleases(org, repoName);
        let forks = await listForks(org, repoName);

        stars = sortArrayByAsc(stars, "date");
        issues = sortArrayByAsc(issues, "created_at");
        weeklyCommitActivity = sortArrayByAsc(weeklyCommitActivity, "date");
        lastYearCommitActivity = sortArrayByAsc(lastYearCommitActivity, "date");
        allContributorCommitActivity = sortArrayByAsc(allContributorCommitActivity, "total", false);
        pullRequests = sortArrayByAsc(pullRequests, "created_at");
        releases = sortArrayByAsc(releases, "created_at");
        forks = sortArrayByAsc(forks, "created_at");

        arrayToFile(stars, `./files/${org}/${repoName}/STARS.json`);
        arrayToFile(issues, `./files/${org}/${repoName}/REPOSITORY-ISSUES.json`);
        arrayToFile(weeklyCommitActivity, `./files/${org}/${repoName}/WEEKLY-COMMIT-ACTIVITY.json`);
        arrayToFile(lastYearCommitActivity, `./files/${org}/${repoName}/LAST-YEAR-COMMIT-ACTIVITY.json`);
        arrayToFile(allContributorCommitActivity, `./files/${org}/${repoName}/ALL-CONTRIBUTOR-COMMIT-ACTVITY.json`);
        arrayToFile(pullRequests, `./files/${org}/${repoName}/PULL-REQUESTS.json`);
        arrayToFile(releases, `./files/${org}/${repoName}/RELEASES.json`);
        arrayToFile(forks, `./files/${org}/${repoName}/FORKS.json`);
    }
};

const getAggregateAnalyticsForOrganization = async (org) => {
    const response = await octokit.paginate(`GET /orgs/${org}/repos`);
    let result = response.map((item) => {
        const name = item.name;
        return {
            name
        }
    });

    let stars = [];
    let issues = [];
    let weeklyCommitActivity = [];
    let lastYearCommitActivity = [];
    let allContributorCommitActivity = [];
    let pullRequests = [];
    let releases = [];
    let forks = [];

    fs.mkdir(`./files/aggregate/${org}`, { recursive: true }, (err) => {
        if (err) return console.log(err);
        console.log(`${org} directory created ... adding files`);
    });

    for (let i = 0; i < result.length; i++) {
        const repoName = result[i].name;
        const _stars = await listStargazers(org, repoName);
        const _issues = await listRepositoryIssues(org, repoName);
        const _weeklyCommitActivity = await getWeeklyCommitActivity(org, repoName)
        const _lastYearCommitActivity = await getLastYearCommitActivity(org, repoName)
        const _allContributorCommitActivity = await getAllContributorCommitActivity(org, repoName);
        const _pullRequests = await listPullRequests(org, repoName);
        const _releases = await listReleases(org, repoName);
        const _forks = await listForks(org, repoName);
        stars = [...stars, ..._stars];
        issues = [...issues, ..._issues];
        weeklyCommitActivity = [...weeklyCommitActivity, ..._weeklyCommitActivity];
        lastYearCommitActivity = [...lastYearCommitActivity, ..._lastYearCommitActivity];
        allContributorCommitActivity = [...allContributorCommitActivity, ..._allContributorCommitActivity];
        pullRequests = [...pullRequests, ..._pullRequests];
        releases = [...releases, ..._releases];
        forks = [...forks, ..._forks];
    };

    stars = sortArrayByAsc(stars, "date");
    issues = sortArrayByAsc(issues, "created_at");
    weeklyCommitActivity = sortArrayByAsc(weeklyCommitActivity, "date");
    lastYearCommitActivity = sortArrayByAsc(lastYearCommitActivity, "date");
    allContributorCommitActivity = sortArrayByAsc(allContributorCommitActivity, "total", false);
    pullRequests = sortArrayByAsc(pullRequests, "created_at");
    releases = sortArrayByAsc(releases, "created_at");
    forks = sortArrayByAsc(forks, "created_at");

    arrayToFile(stars, `./files/aggregate/${org}/STARS.json`);
    arrayToFile(issues, `./files/aggregate/${org}/ISSUES.json`);
    arrayToFile(weeklyCommitActivity, `./files/aggregate/${org}/WEEKLY-COMMIT-ACTIVITY.json`);
    arrayToFile(lastYearCommitActivity, `./files/aggregate/${org}/LAST-YEAR-COMMIT-ACTIVITY.json`);
    arrayToFile(allContributorCommitActivity, `./files/aggregate/${org}/ALL-CONTRIBUTOR-COMMIT-ACTIVITY.json`);
    arrayToFile(pullRequests, `./files/aggregate/${org}/PULL-REQUESTS.json`);
    arrayToFile(releases, `./files/aggregate/${org}/RELEASES.json`);
    arrayToFile(forks, `./files/aggregate/${org}/FORKS.json`);
    arrayToFile(await listOrganisationRepositories(org), `./files/aggregate/${org}/REPOSITORIES.json`);
}

const getSpecificRepositoryAnalytics = async (category, owner, repo) => {

    fs.mkdir(`./files/specific/${owner}/${repo}`, { recursive: true }, (err) => {
        if (err) return console.log(err);
        console.log(`${owner}/${repo} created successfully ... adding files`);
    })

    let stars = await listStargazers(owner, repo);
    let issues = await listRepositoryIssues(owner, repo);
    let weeklyCommitActivity = await getWeeklyCommitActivity(owner, repo)
    let lastYearCommitActivity = await getLastYearCommitActivity(owner, repo)
    let allContributorCommitActivity = await getAllContributorCommitActivity(owner, repo);
    let pullRequests = await listPullRequests(owner, repo);
    let releases = await listReleases(owner, repo);
    let forks = await listForks(owner, repo);

    stars = sortArrayByAsc(stars, "date");
    issues = sortArrayByAsc(issues, "created_at");
    weeklyCommitActivity = sortArrayByAsc(weeklyCommitActivity, "date");
    lastYearCommitActivity = sortArrayByAsc(lastYearCommitActivity, "date");
    allContributorCommitActivity = sortArrayByAsc(allContributorCommitActivity, "total", false);
    pullRequests = sortArrayByAsc(pullRequests, "created_at");
    releases = sortArrayByAsc(releases, "created_at");
    forks = sortArrayByAsc(forks, "created_at");

    arrayToFile(stars, `./files/specific/${category}/${owner}/${repo}/STARS.json`);
    arrayToFile(issues, `./files/specific/${category}/${owner}/${repo}/ISSUES.json`);
    arrayToFile(weeklyCommitActivity, `./files/specific/${category}/${owner}/${repo}/WEEKLY-COMMIT-ACTIVITY.json`);
    arrayToFile(lastYearCommitActivity, `./files/specific/${category}/${owner}/${repo}/LAST-YEAR-COMMIT-ACTIVITY.json`);
    arrayToFile(allContributorCommitActivity, `./files/specific/${category}/${owner}/${repo}/ALL-CONTRIBUTOR-COMMIT-ACTIVITY.json`);
    arrayToFile(pullRequests, `./files/specific/${category}/${owner}/${repo}/PULL-REQUESTS.json`);
    arrayToFile(releases, `./files/specific/${category}/${owner}/${repo}/RELEASES.json`);
    arrayToFile(forks, `./files/specific/${category}/${owner}/${repo}/FORKS.json`);
}

// getAggregateAnalyticsForOrganization(POLYGON_OWNER);
// getAllRepositoryAnalyticsForOrganization(POLYGON_OWNER);