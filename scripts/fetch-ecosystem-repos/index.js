require("toml-require").install({ toml: require("toml") });
const fs = require("fs")

// input: ecosystem name --> output: list of repos
const fetchListOfReposForEcosystem = (ecosystemName) => {
    const letter = ecosystemName.substring(0, 1);
    const toml = require(`./crypto-ecosystems/data/ecosystems/${letter}/${ecosystemName}`);
    const repos = toml.repo.map((repo) => {
        return repo.url;
    });
    return repos;
};

const repoAggregator = (list) => {
    let resultList = [];
    list.forEach((ecosystemName) => {
        resultList.push(...fetchListOfReposForEcosystem(ecosystemName));
    });
    fs.writeFileSync("tempResults.json", JSON.stringify(resultList))
};

const list = ["ethereum"];
repoAggregator(list);