const { Octokit: _Octokit } = require("octokit");
const { toCSVFile, appendAndFormat } = require("../../utils");
const fs = require("fs");

const githubRESTMapFn = (owner, repo, list) => {
    let page = list.slice(-1).pop();
    if (page == undefined) page = 1;
    else page = page.page;

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
        listForks: `GET /repos/${owner}/${repo}/forks`,
        listCommits: `GET /repos/${owner}/${repo}/commits`
    };
    Object.keys(routeMap).forEach((key) => {
        routeMap[key] = `${routeMap[key]}${page ? `?page=${page}` : ''}`;
    });
    return routeMap;
};

class Octokit {
    constructor(octokit) {
        this.octokit = octokit;
    }

    paginate = async (route, list, owner, repo) => {
        const fileLocation = `./files/repositories/`;
        const endLoc = `${owner}#${repo}/`;
        const saveLoc = await this.fetchFileLocation(route, fileLocation, endLoc);
        await this.octokit.paginate(route, {
            headers: {
                "accept": "application/vnd.github.v3.star+json",
            }
        }, async (response, done) => {
            const { etag: responseTag } = response.headers;
            const rateLimitRemaining = response.headers['x-ratelimit-remaining'];
            if (rateLimitRemaining < 2) {
                done();
            }

            let currentPage = response.url.split("?page=")[1];
            currentPage = parseInt(currentPage);

            const popList = list.slice(-1).pop();

            const splittedResponseTagLen = responseTag.split('"').length;
            const trimmedResponseTag = responseTag.split('"')[splittedResponseTagLen - 2];
            const fileName = `${currentPage}#${trimmedResponseTag}.csv`;

            if (popList == undefined) {
                const data = appendAndFormat(owner, repo, response.data);
                await toCSVFile(data, saveLoc + fileName);
                return;
            }

            if (currentPage != parseInt(popList.page)) {
                const data = appendAndFormat(owner, repo, response.data);
                await toCSVFile(data, saveLoc + fileName);
                return;
            }

            if (trimmedResponseTag != popList.etag) {
                const files = fs.readdirSync(saveLoc, (err) => {
                    if (err) return console.log(`${err} for directory at ${location}`);
                });;
                let result = files.map((file, index) => {
                    const fileName = file.split(".csv")[0];
                    const [page, etag] = fileName.split("#");
                    if (currentPage == parseInt(page)) return index;
                    else return 0;
                });
                result = result.filter((number) => {
                    return number != 0;
                })[0];
                const file = files[result];
                if (file) {
                    fs.unlink(saveLoc + file, (err) => {
                        if (err) return console.log("Error: ", err);
                    });
                }
                const prevPage = currentPage - 1;
                const prevPageRoute = route.split("?page=")[0] + `?page=${prevPage}`;
                return this.paginate(prevPageRoute, list.slice(0, list.length - 1), owner, repo);
            }
            return;
        });
    };

    request = async (route) => {
        const response = await this.octokit.request(route, {
            headers: {
                "accept": "application/vnd.github.v3.star+json",
            }
        });
        return response;
    };

    fetchFileLocation = async (route, fileLocation, endLoc) => {
        const str = route.split("?page=")[0].split("/");
        const metric = str[str.length - 1];
        switch (metric) {
            case "stargazers":
                return fileLocation + `stars/` + endLoc;
            case "issues":
                return fileLocation + `issues/` + endLoc;
            case "code_frequency":
                return fileLocation + `weekly-commit-activity/` + endLoc;
            case "commit_activity":
                return fileLocation + `last-year-commit-activity/` + endLoc;
            case "pulls":
                return fileLocation + `pull-requests/` + endLoc;
            case "releases":
                return fileLocation + `releases/` + endLoc;
            case "forks":
                return fileLocation + `forks/` + endLoc;
            case "languages":
                return fileLocation + `languages/` + endLoc;
            case "contributors":
                return fileLocation + `contributors/` + endLoc;
            case "commits":
                return fileLocation + `commits/` + endLoc;
        }
    };

    listCommits = async (owner, repo, list) => {
        await this.paginate(githubRESTMapFn(owner, repo, list).listCommits, list, owner, repo);
    };

    listStargazers = async (owner, repo, list) => {
        await this.paginate(githubRESTMapFn(owner, repo, list).listStargazers, list, owner, repo);
    };

    listWatchers = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo, list).listWatchers, list, owner, repo);
        return response;
    };

    listBranches = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo, list).listBranches, list, owner, repo);
        return response;
    };

    listRepositoryIssues = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo, list).listRepositoryIssues, list, owner, repo);
        return response;
    };

    getWeeklyCommitActivity = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo, list).getWeeklyCommitActivity, list, owner, repo);
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
        const response = await this.paginate(githubRESTMapFn(owner, repo, list).getLastYearCommitActivity, list, owner, repo);
        return response;
    };

    getAllContributorCommitActivity = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo, list).getAllContributorCommitActivity, list, owner, repo);
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

    // TODO:
    listOrganizationMembers = async (org) => {
        const response = await this.paginate(githubRESTMapFn(org).listOrganizationMembers, list, owner, repo);
        return response;
    };

    listPullRequests = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo, list).listPullRequests, list, owner, repo);
        return response;
    };

    listReleases = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo, list).listReleases, list, owner, repo);
        return response;
    };

    // TODO:
    listOrganisationRepositories = async (org) => {
        const response = await this.paginate(githubRESTMapFn(org).listOrganisationRepositories);
        return response;
    };

    listRepositoryContributors = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo, list).listRepositoryContributors, list, owner, repo);
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
        const response = await this.paginate(githubRESTMapFn(owner, repo, list).listForks, list, owner, repo);
        return response;
    };
}

const octokit = new Octokit(new _Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN || "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"
}));

module.exports = { octokit };