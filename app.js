const { octokit } = require("./src/fetchers/octokit");
const config = require("./config.json");
const { fetcherMap } = require("./src/mappings");
const fetcher = fetcherMap("octokit"); //using Octokit
const { getOwnerAndRepo, toCSVFile, handleFileSystemObject, appendAndFormat } = require("./utils");

const getSpecificRepositoryAnalytics = async (config) => {
    const repositories = config.repositories;
    for (i = 0; i < repositories.length; i++) {
        const repository = repositories[i];
        const { owner, repo } = getOwnerAndRepo(repository);

        const fileLocation = `./files/repositories/`;
        const endLoc = `${owner}#${repo}/`;
        const starsLoc = fileLocation + `stars/` + endLoc;
        const issuesLoc = fileLocation + `issues/` + endLoc;
        const weeklyCommitActivityLoc = fileLocation + `weekly-commit-activity/` + endLoc;
        const lastYearCommitActivityLoc = fileLocation + `last-year-commit-activity/` + endLoc;
        const pullRequestsLoc = fileLocation + `pull-requests/` + endLoc;
        const releasesLoc = fileLocation + `releases/` + endLoc;
        const forksLoc = fileLocation + `forks/` + endLoc;
        const languagesLoc = fileLocation + `languages/` + endLoc;
        const contributorsLoc = fileLocation + `contributors/` + endLoc;
        const commitsLoc = fileLocation + `commits/` + endLoc;
       
        const starsList = await handleFileSystemObject(starsLoc);
        const issuesList = await handleFileSystemObject(issuesLoc);
        const wcaList = await handleFileSystemObject(weeklyCommitActivityLoc);
        const lycaList = await handleFileSystemObject(lastYearCommitActivityLoc);
        const pullRequestsList = await handleFileSystemObject(pullRequestsLoc);
        const releasesList = await handleFileSystemObject(releasesLoc);
        const forksList = await handleFileSystemObject(forksLoc);
        const languagesList = await handleFileSystemObject(languagesLoc);
        const contributorsList = await handleFileSystemObject(contributorsLoc);
        const commitsList = await handleFileSystemObject(commitsLoc);

        await fetcher.stars(owner, repo, starsList);
        await fetcher.issues(owner, repo, issuesList);
        await fetcher.weeklyCommitActivity(owner, repo, wcaList);
        await fetcher.lastYearCommitActivity(owner, repo, lycaList);
        await fetcher.pullRequests(owner, repo, pullRequestsList);
        await fetcher.releases(owner, repo, releasesList);
        await fetcher.forks(owner, repo, forksList);
        await fetcher.languages(owner, repo, languagesList);
        await fetcher.contributors(owner, repo, contributorsList);
        await fetcher.commits(owner, repo, commitsList);
    }
};

getSpecificRepositoryAnalytics(config);

// 4965 for 393
// 4993 for 9mgg