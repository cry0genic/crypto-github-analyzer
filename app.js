const { octokit } = require("./src/fetchers/octokit");
const config = require("./config.json");
const { fileMap, fetcherMap } = require("./src/mappings");
const fetcher = fetcherMap("octokit"); //using Octokit
const { getOwnerAndRepo, toCSVFile, makeDirectory, appendAndFormat } = require("./utils");

const getSpecificRepositoryAnalytics = async (config) => {
    const repositories = config.repositories;
    for (i = 0; i < repositories.length; i++) {
        const repository = repositories[i];
        const { owner, repo } = getOwnerAndRepo(repository);
        const fileLocation = `./files/repositories/${owner}/${repo}/`;

        const exists = makeDirectory(fileLocation);
        if (exists) {
            return console.log("Directory already exists!");
        }

        const stars = appendAndFormat(owner, repo, await fetcher.stars(owner, repo));
        const issues = appendAndFormat(owner, repo, await fetcher.issues(owner, repo));
        const weeklyCommitActivity = appendAndFormat(owner, repo, await fetcher.weeklyCommitActivity(owner, repo));
        const lastYearCommitActivity = appendAndFormat(owner, repo, await fetcher.lastYearCommitActivity(owner, repo));
        const pullRequests = appendAndFormat(owner, repo, await fetcher.pullRequests(owner, repo));
        const releases = appendAndFormat(owner, repo, await fetcher.releases(owner, repo));
        const forks = appendAndFormat(owner, repo, await fetcher.forks(owner, repo));
        const languages = appendAndFormat(owner, repo, await fetcher.languages(owner, repo));
        const contributors = appendAndFormat(owner, repo, await fetcher.contributors(owner, repo));

        await toCSVFile(stars, fileLocation + `${fileMap.stars}`);
        await toCSVFile(issues, fileLocation + `${fileMap.issues}`);
        await toCSVFile(weeklyCommitActivity, fileLocation + `${fileMap.weeklyCommitActivity}`);
        await toCSVFile(lastYearCommitActivity, fileLocation + `${fileMap.lastYearCommitActivity}`);
        await toCSVFile(pullRequests, fileLocation + `${fileMap.pullRequests}`);
        await toCSVFile(releases, fileLocation + `${fileMap.releases}`);
        await toCSVFile(forks, fileLocation + `${fileMap.forks}`);
        await toCSVFile(languages, fileLocation + `${fileMap.languages}`);
        await toCSVFile(contributors, fileLocation + `${fileMap.contributors}`);
    }
};

getSpecificRepositoryAnalytics(config);