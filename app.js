const { octokit } = require("./src/fetchers/octokit");
const config = require("./config.json");
const { fileMap, fetcherMap } = require("./src/mappings");
const fetcher = fetcherMap("octokit"); //using Octokit
const { getOwnerAndRepo, toCSVFile, makeDirectory } = require("./utils");

const getSpecificRepositoryAnalytics = async (config) => {
    const repositories = config.repositories;
    for (i = 0; i < repositories.length; i++) {
        const repository = repositories[i];
        const { owner, repo } = getOwnerAndRepo(repository);
        const fileLocation = `./files/repositories/${owner}-${repo}/`;

        const exists = makeDirectory(fileLocation);
        if (exists) {
            return;
        }

        const stars = await fetcher.stars(owner, repo);
        const issues = await fetcher.issues(owner, repo);
        const weeklyCommitActivity = await fetcher.weeklyCommitActivity(owner, repo);
        const lastYearCommitActivity = await fetcher.lastYearCommitActivity(owner, repo);
        const pullRequests = await fetcher.pullRequests(owner, repo);
        const releases = await fetcher.releases(owner, repo);
        const forks = await fetcher.forks(owner, repo);
        const languages = await fetcher.languages(owner, repo);
        const contributors = await fetcher.contributors(owner, repo);

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