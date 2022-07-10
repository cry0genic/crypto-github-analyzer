const { octokit } = require("./src/fetchers/octokit");
const config = require("./config.json");
const { fetcherMap } = require("./src/mappings");
const fetcher = fetcherMap("octokit"); //using Octokit
const { getOwnerAndRepo, toCSVFile, makeDirectory, appendAndFormat } = require("./utils");

const getSpecificRepositoryAnalytics = async (config) => {
    const repositories = config.repositories;
    for (i = 0; i < repositories.length; i++) {
        const repository = repositories[i];
        const { owner, repo } = getOwnerAndRepo(repository);
        const fileLocation = `./files/repositories/`;
        const endLoc = `${owner}#${repo}.csv`;
        const starsLoc = fileLocation + `stars/`;
        const issuesLoc = fileLocation + `issues/`;
        const weeklyCommitActivityLoc = fileLocation + `weekly-commit-activity/`;
        const lastYearCommitActivityLoc = fileLocation + `last-year-commit-activity/`;
        const pullRequestsLoc = fileLocation + `pull-requests/`;
        const releasesLoc = fileLocation + `releases/`;
        const forksLoc = fileLocation + `forks/`;
        const languagesLoc = fileLocation + `languages/`;
        const contributorsLoc = fileLocation + `contributors/`;

        makeDirectory(starsLoc);
        makeDirectory(issuesLoc);
        makeDirectory(weeklyCommitActivityLoc);
        makeDirectory(lastYearCommitActivityLoc);
        makeDirectory(pullRequestsLoc);
        makeDirectory(releasesLoc);
        makeDirectory(forksLoc);
        makeDirectory(languagesLoc);
        makeDirectory(contributorsLoc);

        const stars = appendAndFormat(owner, repo, await fetcher.stars(owner, repo));
        const issues = appendAndFormat(owner, repo, await fetcher.issues(owner, repo));
        const weeklyCommitActivity = appendAndFormat(owner, repo, await fetcher.weeklyCommitActivity(owner, repo));
        const lastYearCommitActivity = appendAndFormat(owner, repo, await fetcher.lastYearCommitActivity(owner, repo));
        const pullRequests = appendAndFormat(owner, repo, await fetcher.pullRequests(owner, repo));
        const releases = appendAndFormat(owner, repo, await fetcher.releases(owner, repo));
        const forks = appendAndFormat(owner, repo, await fetcher.forks(owner, repo));
        const languages = appendAndFormat(owner, repo, await fetcher.languages(owner, repo));
        const contributors = appendAndFormat(owner, repo, await fetcher.contributors(owner, repo));

        await toCSVFile(stars, starsLoc + endLoc);
        await toCSVFile(issues, issuesLoc + endLoc);
        await toCSVFile(weeklyCommitActivity, weeklyCommitActivityLoc + endLoc);
        await toCSVFile(lastYearCommitActivity, lastYearCommitActivityLoc + endLoc);
        await toCSVFile(pullRequests, pullRequestsLoc + endLoc);
        await toCSVFile(releases, releasesLoc + endLoc);
        await toCSVFile(forks, forksLoc + endLoc);
        await toCSVFile(languages, languagesLoc + endLoc);
        await toCSVFile(contributors, contributorsLoc + endLoc);
    }
};

getSpecificRepositoryAnalytics(config);