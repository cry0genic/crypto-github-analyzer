const { Octokit: _Octokit } = require("octokit");
// const { sortArrayByAsc, handleNullSplit, toDateTime, arrayToFile } = require("../../utils");

const githubRESTMapFn = (owner, repo, page) => {
    const routeMap = {
        listStargazers: `GET /repos/${owner}/${repo}/stargazers`,
        listWatchers: `GET /repos/${owner}/${repo}/subscribers`,
        listBranches: `GET /repos/${owner}/${repo}/branches`,
        listRepositoryIssues: `GET /repos/${owner}/${repo}/issues`,
        getWeeklyCommitActivity: `GET /repos/${owner}/${repo}/stats/code_frequency`,
        getLastYearCommitActivity: `GET /repos/${owner}/${repo}/stats/commit_activity`,
        getAllContributorCommitActivity: `GET /repos/${owner}/${repo}/stats/contributors`,
        getWeeklyCommitCount: `GET /repos/${owner}/${repo}/stats/participation`,
        getHourlyCommitCountForEachDay: `GET /repos/${owner}/${repo}/stats/punch_card`,
        listOrganizationMembers: `GET /orgs/${owner}/members`,
        listPullRequests: `GET /repos/${owner}/${repo}/pulls`,
        listReleases: `GET /repos/${owner}/${repo}/releases`,
        listOrganisationRepositories: `GET /orgs/${owner}/repos`,
        listRepositoryContributors: `GET /repos/${owner}/${repo}/contributors`,
        listRepositoryLanguages: `GET /repos/${owner}/${repo}/languages`,
        listForks: `GET /repos/${owner}/${repo}/forks`
    };
    Object.keys(routeMap).forEach((key) => {
        routeMap[key] = `${routeMap[key]}${page?`?page=${page}`:''}`
    })
    return routeMap;
};

class Octokit {
    constructor(octokit) {
        this.octokit = octokit;
    }

    paginate = async (route) => {
        const response = await this.octokit.paginate(route, {
            headers: {
                "accept": "application/vnd.github.v3.star+json",
            }
        }, (response, done) => {
            console.log(response.url, response.status, response.data.length)
            return response.data
        });
        return response;
    };

    request = async (route) => {
        const response = await this.octokit.request(route, {
            headers: {
                "accept": "application/vnd.github.v3.star+json",
            }
        });
        return response;
    };

    listStargazers = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listStargazers);
        return response;
    };

    listWatchers = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listWatchers);
        return response;
    };

    listBranches = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listBranches);
        return response;
    };

    listRepositoryIssues = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listRepositoryIssues);
        return response;
    };

    getWeeklyCommitActivity = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).getWeeklyCommitActivity);
        let result = response.map((item) => {
            const date = item[0];
            const additions = item[1];
            const deletions = item[2];
            return {
                date,
                additions,
                deletions,
            };
        });
        return result;
    };

    getLastYearCommitActivity = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).getLastYearCommitActivity);
        return response;
    };

    getAllContributorCommitActivity = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).getAllContributorCommitActivity);
        return response;
    };

    getWeeklyCommitCount = async (owner, repo) => {
        const response = await this.request(githubRESTMapFn(owner, repo).getWeeklyCommitCount);
        return response.data;
    };

    getHourlyCommitCountForEachDay = async (owner, repo) => {
        const response = await this.request(githubRESTMapFn(owner, repo).getHourlyCommitCountForEachDay);
        console.log(response);
    };

    listOrganizationMembers = async (org) => {
        const response = await this.paginate(githubRESTMapFn(org).listOrganizationMembers);
        return response;
    };

    listPullRequests = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listPullRequests);
        return response;
    };

    listReleases = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listReleases);
        return response;
    };

    listOrganisationRepositories = async (org) => {
        const response = await this.paginate(githubRESTMapFn(org).listOrganisationRepositories);
        return response;
    };

    listRepositoryContributors = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listRepositoryContributors);
        return response;
    };

    listRepositoryLanguages = async (owner, repo) => {
        const response = await this.request(githubRESTMapFn(owner, repo).listRepositoryLanguages);
        return response.data;
    };

    // listRepositoryTags
    // getRepositoryTeams
    // getAllRepositoryTopics

    listForks = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listForks);
        return response;
    };
}

const octokit = new Octokit(new _Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN || "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"
}));

module.exports = { octokit };