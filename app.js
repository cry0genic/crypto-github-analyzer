const { octokit } = require("./src/fetchers/octokit");
require("toml-require").install({ toml: require("toml") });

const { arrayToFile, makeDirectory, splitGitHubURL, getOwnerAndRepo } = require("./utils");
const { fileMap, fetcherMap } = require("./src/mappings");

const fetcher = fetcherMap("octokit"); //using Octokit

// const dataConfig = require("./public/config/config.json");
// const { ecosystems, dataProvider } = dataConfig[0];

// ---

const fetchConfigData = async () => {
    
};

const getSpecificRepositoryAnalytics = async (repository) => {
    const { owner, repo } = getOwnerAndRepo(repository);
    const fileLocation = `./files/${owner}-${repo}/`;

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

    // arrayToFile(stars, fileLocation + `/${fileMap.stars}`);
    // arrayToFile(issues, fileLocation + `/${fileMap.issues}`);
    // arrayToFile(weeklyCommitActivity, fileLocation + `/${fileMap.weeklyCommitActivity}`);
    // arrayToFile(lastYearCommitActivity, fileLocation + `/${fileMap.lastYearCommitActivity}`);
    // arrayToFile(pullRequests, fileLocation + `/${fileMap.pullRequests}`);
    // arrayToFile(releases, fileLocation + `/${fileMap.releases}`);
    // arrayToFile(forks, fileLocation + `/${fileMap.forks}`);
    // arrayToFile(languages, fileLocation + `/${fileMap.languages}`);
    // arrayToFile(contributors, fileLocation + `/${fileMap.contributors}`);
};

const a = async () => {
    const b = await octokit.getLastYearCommitActivity("maticnetwork", "bor")

}

a()

// const getAggregateAnalyticsForOrganization = async (org) => {
//     const response = await fetcher.listOrganisationRepositories(org);

//     // for (let i = 0; i < response.length; i++) {
//     //     const repo = response[i].name;
//     //     const fileLocation = `./public/files/${ecosystem}-ecosystem/${org}/${repo}`;
//     //     const exists = makeDirectory(fileLocation);
//     //     if (exists) {
//     //         return;
//     //     }
//     // }

//     // const fileLocation = `./public/files/${ecosystem}-ecosystem/orgs-aggregate`;
//     // const exists = makeDirectory(fileLocation);
//     // if (exists) {
//     //     return;
//     // }

//     let ALLstars = [];
//     let ALLissues = [];
//     let ALLweeklyCommitActivity = [];
//     let ALLlastYearCommitActivity = [];
//     let ALLpullRequests = [];
//     let ALLreleases = [];
//     let ALLforks = [];
//     let ALLcontributors = [];

//     for (let i = 0; i < response.length; i++) {
//         const repo = response[i].name;
//         // const fileLocation = `./public/files/${ecosystem}-ecosystem/${org}/${repo}`;

//         const stars = await fetcher.stars(org, repo);
//         const issues = await fetcher.issues(org, repo);
//         const weeklyCommitActivity = await fetcher.weeklyCommitActivity(org, repo);
//         const lastYearCommitActivity = await fetcher.lastYearCommitActivity(org, repo);
//         const pullRequests = await fetcher.pullRequests(org, repo);
//         const releases = await fetcher.releases(org, repo);
//         const forks = await fetcher.forks(org, repo);
//         const languages = await fetcher.languages(org, repo);
//         const contributors = await fetcher.contributors(org, repo);

//         ALLstars = [...ALLstars, ...stars];
//         ALLissues = [...ALLissues, ...issues];
//         ALLweeklyCommitActivity = [...ALLweeklyCommitActivity, ...weeklyCommitActivity];
//         ALLlastYearCommitActivity = [...ALLlastYearCommitActivity, ...lastYearCommitActivity];
//         ALLpullRequests = [...ALLpullRequests, ...pullRequests];
//         ALLreleases = [...ALLreleases, ...releases];
//         ALLforks = [...ALLforks, ...forks];
//         ALLcontributors = [...ALLcontributors, ...contributors];

//         // arrayToFile(stars, fileLocation + `/${fileMap.stars}`);
//         // arrayToFile(issues, fileLocation + `/${fileMap.issues}`);
//         // arrayToFile(weeklyCommitActivity, fileLocation + `/${fileMap.weeklyCommitActivity}`);
//         // arrayToFile(lastYearCommitActivity, fileLocation + `/${fileMap.lastYearCommitActivity}`);
//         // arrayToFile(pullRequests, fileLocation + `/${fileMap.pullRequests}`);
//         // arrayToFile(releases, fileLocation + `/${fileMap.releases}`);
//         // arrayToFile(forks, fileLocation + `/${fileMap.forks}`);
//         // arrayToFile(languages, fileLocation + `/${fileMap.languages}`);
//         // arrayToFile(contributors, fileLocation + `/${fileMap.contributors}`);
//     }

//     return {
//         ALLstars,
//         ALLissues,
//         ALLweeklyCommitActivity,
//         ALLlastYearCommitActivity,
//         ALLpullRequests,
//         ALLreleases,
//         ALLforks,
//         ALLcontributors
//     };
//     // ALLstars = sortArrayByAsc(ALLstars, "date");
//     // ALLissues = sortArrayByAsc(ALLissues, "created_at");
//     // ALLweeklyCommitActivity = sortArrayByAsc(ALLweeklyCommitActivity, "date");
//     // ALLlastYearCommitActivity = sortArrayByAsc(ALLlastYearCommitActivity, "date");
//     // ALLpullRequests = sortArrayByAsc(ALLpullRequests, "created_at");
//     // ALLreleases = sortArrayByAsc(ALLreleases, "published_at");
//     // ALLforks = sortArrayByAsc(ALLforks, "created_at");
//     // ALLcontributors = sortArrayByAsc(ALLcontributors, "contributions", false);

//     // arrayToFile(ALLstars, fileLocation + `/${fileMap.stars}`);
//     // arrayToFile(ALLissues, fileLocation + `/${fileMap.issues}`);
//     // arrayToFile(ALLweeklyCommitActivity, fileLocation + `/${fileMap.weeklyCommitActivity}`);
//     // arrayToFile(ALLlastYearCommitActivity, fileLocation + `/${fileMap.lastYearCommitActivity}`);
//     // arrayToFile(ALLpullRequests, fileLocation + `/${fileMap.pullRequests}`);
//     // arrayToFile(ALLreleases, fileLocation + `/${fileMap.releases}`);
//     // arrayToFile(ALLforks, fileLocation + `/${fileMap.forks}`);
//     // arrayToFile(ALLcontributors, fileLocation + `/${fileMap.contributors}`);
// };

// ----
// const fetchEcosystemOrganizationsAndRepositoriesAnalytics = async (ecosystems) => {
//     for (i = 0; i < ecosystems.length; i++) {
//         const ecosystem = ecosystems[i];
//         const ecosystemFileLocation = `./public/files/${ecosystem}-ecosystem/ecosystem-aggregate`;
//         const orgsFileLocation = `./public/files/${ecosystem}-ecosystem/orgs-aggregate`;
//         const reposFileLocation = `./public/files/${ecosystem}-ecosystem/apps-aggregate`;
//         const tomlLocation = `./public/toml/${ecosystem}.toml`;
//         const toml = require(tomlLocation);
//         const orgsURL = toml.github_organizations;
//         const reposURL = toml.repo;

//         const ecosystemDirectoryExists = makeDirectory(ecosystemFileLocation);
//         const orgsDirectoryExists = makeDirectory(orgsFileLocation);
//         const reposDirectoryExists = makeDirectory(reposFileLocation);

//         if (ecosystemDirectoryExists || orgsDirectoryExists || reposDirectoryExists) {
//             return
//         }

//         let orgsALLstars = [];
//         let orgsALLissues = [];
//         let orgsALLweeklyCommitActivity = [];
//         let orgsALLlastYearCommitActivity = [];
//         let orgsALLpullRequests = [];
//         let orgsALLreleases = [];
//         let orgsALLforks = [];
//         let orgsALLcontributors = [];

//         for (j = 0; j < orgsURL.length; j++) {
//             const org = splitGitHubURL(orgsURL[j], true);

//             let {
//                 ALLstars: stars,
//                 ALLissues: issues,
//                 ALLweeklyCommitActivity: weeklyCommitActivity,
//                 ALLlastYearCommitActivity: lastYearCommitActivity,
//                 ALLpullRequests: pullRequests,
//                 ALLreleases: releases,
//                 ALLforks: forks,
//                 ALLcontributors: contributors,
//             } = await getAggregateAnalyticsForOrganization(org);

//             orgsALLstars = [...orgsALLstars, ...stars];
//             orgsALLissues = [...orgsALLissues, ...issues];
//             orgsALLweeklyCommitActivity = [...orgsALLweeklyCommitActivity, ...weeklyCommitActivity];
//             orgsALLlastYearCommitActivity = [...orgsALLlastYearCommitActivity, ...lastYearCommitActivity];
//             orgsALLpullRequests = [...orgsALLpullRequests, ...pullRequests];
//             orgsALLreleases = [...orgsALLreleases, ...releases];
//             orgsALLforks = [...orgsALLforks, ...forks];
//             orgsALLcontributors = [...orgsALLcontributors, ...contributors];
//         }

//         orgsALLstars = sortArrayByAsc(orgsALLstars, "date");
//         orgsALLissues = sortArrayByAsc(orgsALLissues, "created_at");
//         orgsALLweeklyCommitActivity = sortArrayByAsc(orgsALLweeklyCommitActivity, "date");
//         orgsALLlastYearCommitActivity = sortArrayByAsc(orgsALLlastYearCommitActivity, "date");
//         orgsALLpullRequests = sortArrayByAsc(orgsALLpullRequests, "created_at");
//         orgsALLreleases = sortArrayByAsc(orgsALLreleases, "published_at");
//         orgsALLforks = sortArrayByAsc(orgsALLforks, "created_at");
//         orgsALLcontributors = sortArrayByAsc(orgsALLcontributors, "contributions", false);

//         arrayToFile(orgsALLstars, orgsFileLocation + `/${fileMap.stars}`);
//         arrayToFile(orgsALLissues, orgsFileLocation + `/${fileMap.issues}`);
//         arrayToFile(orgsALLweeklyCommitActivity, orgsFileLocation + `/${fileMap.weeklyCommitActivity}`);
//         arrayToFile(orgsALLlastYearCommitActivity, orgsFileLocation + `/${fileMap.lastYearCommitActivity}`);
//         arrayToFile(orgsALLpullRequests, orgsFileLocation + `/${fileMap.pullRequests}`);
//         arrayToFile(orgsALLreleases, orgsFileLocation + `/${fileMap.releases}`);
//         arrayToFile(orgsALLforks, orgsFileLocation + `/${fileMap.forks}`);
//         arrayToFile(orgsALLcontributors, orgsFileLocation + `/${fileMap.contributors}`);

//         let reposALLstars = [];
//         let reposALLissues = [];
//         let reposALLweeklyCommitActivity = [];
//         let reposALLlastYearCommitActivity = [];
//         let reposALLpullRequests = [];
//         let reposALLreleases = [];
//         let reposALLforks = [];
//         let reposALLcontributors = [];

//         for (k = 0; k < reposURL.length; k++) {
//             const { owner, repo } = splitGitHubURL(reposURL[k].url);
//             const {
//                 stars,
//                 issues,
//                 weeklyCommitActivity,
//                 lastYearCommitActivity,
//                 pullRequests,
//                 releases,
//                 forks,
//                 contributors
//             } = await getSpecificRepositoryAnalytics(owner, repo);

//             reposALLstars = [...reposALLstars, ...stars];
//             reposALLissues = [...reposALLissues, ...issues];
//             reposALLweeklyCommitActivity = [...reposALLweeklyCommitActivity, ...weeklyCommitActivity];
//             reposALLlastYearCommitActivity = [...reposALLlastYearCommitActivity, ...lastYearCommitActivity];
//             reposALLpullRequests = [...reposALLpullRequests, ...pullRequests];
//             reposALLreleases = [...reposALLreleases, ...releases];
//             reposALLforks = [...reposALLforks, ...forks];
//             reposALLcontributors = [...reposALLcontributors, ...contributors];
//         }

//         reposALLstars = sortArrayByAsc(reposALLstars, "date");
//         reposALLissues = sortArrayByAsc(reposALLissues, "created_at");
//         reposALLweeklyCommitActivity = sortArrayByAsc(reposALLweeklyCommitActivity, "date");
//         reposALLlastYearCommitActivity = sortArrayByAsc(reposALLlastYearCommitActivity, "date");
//         reposALLpullRequests = sortArrayByAsc(reposALLpullRequests, "created_at");
//         reposALLreleases = sortArrayByAsc(reposALLreleases, "published_at");
//         reposALLforks = sortArrayByAsc(reposALLforks, "created_at");
//         reposALLcontributors = sortArrayByAsc(reposALLcontributors, "contributions", false);

//         arrayToFile(reposALLstars, reposFileLocation + `/${fileMap.stars}`);
//         arrayToFile(reposALLissues, reposFileLocation + `/${fileMap.issues}`);
//         arrayToFile(reposALLweeklyCommitActivity, reposFileLocation + `/${fileMap.weeklyCommitActivity}`);
//         arrayToFile(reposALLlastYearCommitActivity, reposFileLocation + `/${fileMap.lastYearCommitActivity}`);
//         arrayToFile(reposALLpullRequests, reposFileLocation + `/${fileMap.pullRequests}`);
//         arrayToFile(reposALLreleases, reposFileLocation + `/${fileMap.releases}`);
//         arrayToFile(reposALLforks, reposFileLocation + `/${fileMap.forks}`);
//         arrayToFile(reposALLcontributors, reposFileLocation + `/${fileMap.contributors}`);

//         let ecosystemALLstars = [];
//         let ecosystemALLissues = [];
//         let ecosystemALLweeklyCommitActivity = [];
//         let ecosystemALLlastYearCommitActivity = [];
//         let ecosystemALLpullRequests = [];
//         let ecosystemALLreleases = [];
//         let ecosystemALLforks = [];
//         let ecosystemALLcontributors = [];

//         ecosystemALLstars = [...orgsALLstars, ...reposALLstars];
//         ecosystemALLissues = [...orgsALLissues, ...reposALLissues];
//         ecosystemALLweeklyCommitActivity = [...orgsALLweeklyCommitActivity, ...reposALLweeklyCommitActivity];
//         ecosystemALLlastYearCommitActivity = [...orgsALLlastYearCommitActivity, ...reposALLlastYearCommitActivity];
//         ecosystemALLpullRequests = [...orgsALLpullRequests, ...reposALLpullRequests];
//         ecosystemALLreleases = [...orgsALLreleases, ...reposALLreleases];
//         ecosystemALLforks = [...orgsALLforks, ...reposALLforks];
//         ecosystemALLcontributors = [...orgsALLcontributors, ...reposALLcontributors];

//         ecosystemALLstars = sortArrayByAsc(ecosystemALLstars, "date");
//         ecosystemALLissues = sortArrayByAsc(ecosystemALLissues, "created_at");
//         ecosystemALLweeklyCommitActivity = sortArrayByAsc(ecosystemALLweeklyCommitActivity, "date");
//         ecosystemALLlastYearCommitActivity = sortArrayByAsc(ecosystemALLlastYearCommitActivity, "date");
//         ecosystemALLpullRequests = sortArrayByAsc(ecosystemALLpullRequests, "created_at");
//         ecosystemALLreleases = sortArrayByAsc(ecosystemALLreleases, "published_at");
//         ecosystemALLforks = sortArrayByAsc(ecosystemALLforks, "created_at");
//         ecosystemALLcontributors = sortArrayByAsc(ecosystemALLcontributors, "contributions", false);

//         arrayToFile(ecosystemALLstars, ecosystemFileLocation + `/${fileMap.stars}`);
//         arrayToFile(ecosystemALLissues, ecosystemFileLocation + `/${fileMap.issues}`);
//         arrayToFile(ecosystemALLweeklyCommitActivity, ecosystemFileLocation + `/${fileMap.weeklyCommitActivity}`);
//         arrayToFile(ecosystemALLlastYearCommitActivity, ecosystemFileLocation + `/${fileMap.lastYearCommitActivity}`);
//         arrayToFile(ecosystemALLpullRequests, ecosystemFileLocation + `/${fileMap.pullRequests}`);
//         arrayToFile(ecosystemALLreleases, ecosystemFileLocation + `/${fileMap.releases}`);
//         arrayToFile(ecosystemALLforks, ecosystemFileLocation + `/${fileMap.forks}`);
//         arrayToFile(ecosystemALLcontributors, ecosystemFileLocation + `/${fileMap.contributors}`);

//     }
// };

// fetchEcosystemOrganizationsAndRepositoriesAnalytics(ecosystems);