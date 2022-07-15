const config = require("./config.json");
const github = require("./github");

const rootDataDirectoryPath = "./data";

const fetchRepoData = async (repository) => {
    const [owner, repo] = repository.split("/");

    const fetchEnabledData = Object.entries(config.repoData).filter(([_, dataConfig]) => dataConfig.enabled);
    return Promise.all(fetchEnabledData.map(([data, dataConfig]) => {
        // build the data directory path
        const dataDirectoryPath = `${rootDataDirectoryPath}/${data}/${owner}#${repo}`;

        // fetch & store the data from Github (incremental)
        const syncOptions = {
            dataDirectoryPath,
            parameters: { owner, repo },
            outputHeaders: dataConfig.headers
        };
        return github.sync(data, syncOptions);
    }));
};

const fetchData = async () => {
    const repositories_configured = config.repositories;
    console.log(`configured repositories count: ${repositories_configured.length}`);
    while (repositories_configured.length > 0) {
        const repositories = repositories_configured.splice(0, 10);
        console.log(`working on ${repositories.length} repositories`);
        await Promise.all(repositories.map((repository) => fetchRepoData(repository)));
        console.log(`synced repositories count: ${repositories.length}`);
    }
    console.log(`synced all repositories`);
};

fetchData();