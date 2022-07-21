require("toml-require").install({ toml: require("toml") });
const fs = require("fs");
const { Octokit } = require("octokit");
const octokit = new Octokit({
    auth: "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"
});

// input: ecosystem name --> output: list of repos
const fetchListOfReposForEcosystem = async (ecosystemName) => {
    const letter = ecosystemName.substring(0, 1);
    const toml = require(`./crypto-ecosystems/data/ecosystems/${letter}/${ecosystemName}`);
    const repos = toml.repo.map((repo) => {
        return repo.url.split("https://github.com/")[1];
    });
    for (let index = 0; index < toml.github_organizations.length; index++) {
        const orgName = toml.github_organizations[index].split("https://github.com/")[1];
        repos.push(...await fetchOrganizationRepositories(orgName));
    }
    return repos;
};

const repoAggregator = async (list) => {
    let resultList = [];
    for (let index = 0; index < list.length; index++) {
        const ecosys = list[index];
        resultList.push(...await fetchListOfReposForEcosystem(ecosys));
    }
    const uniqueSet = new Set(resultList);
    const newResultList = [...uniqueSet];
    fs.writeFileSync("tempResults.json", JSON.stringify(newResultList));
};

const fetchOrganizationRepositories = async (organization) => {
    let repositories = []
    try {
        repositories = await octokit.paginate(`GET /orgs/${organization}/repos`);
    } catch (error) {
        console.log(error.message);
        if (error.message === "Not Found") {
            return repositories;
        }
        throw error
    }
    return repositories.map((item) => {
        return item.full_name;
    });

};

const list = [
    "ethereum-2-0",
    "ethereum-classic",
    "ethereum-consensus",
    "ethereum-dev-tools",
    "ethereum-erush",
    "ethereum-execution",
    "ethereum-name-service",
    "ethereum-vault",
    "ethereum-virtual-machine",
    "ethereum"
];
repoAggregator(list);