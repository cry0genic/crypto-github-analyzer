const { Octokit: _Octokit } = require("octokit");
// const { sortArrayByAsc, handleNullSplit, toDateTime, arrayToFile } = require("../../utils");

const githubRESTMapFn = (owner, repo) => {
    return {
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
        });
        return response;
    };

    request = async (route) => {
        const response = await this.octokit.request(route);
        return response;
    };

    listStargazers = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listStargazers);
        // let result = response.map((item) => {
        //     const date = handleNullSplit(item.starred_at);
        //     const user = item.user.html_url;
        //     return {
        //         date,
        //         user
        //     };
        // });
        // result = sortArrayByAsc(result, "date");
        return response;
    };

    listWatchers = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listWatchers);
        // let result = response.map((item) => {
        //     const watcher = item.html_url;
        //     return {
        //         watcher
        //     };
        // });
        return response;
    };

    listBranches = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listBranches);
        // let result = response.map((item) => {
        //     const name = item.name;
        //     const branch_protected = item.protected;
        //     return {
        //         name,
        //         branch_protected,
        //     };
        // });
        return response;
    };

    listRepositoryIssues = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listRepositoryIssues);
        // let result = response.map((item) => {
        //     const title = item.title;
        //     const created_at = item.created_at.split("T")[0];
        //     const closed_at = handleNullSplit(item.closed_at);
        //     const user = item.user.login;
        //     const state = item.state;
        //     const updated_at = handleNullSplit(item.updated_at);
        //     return {
        //         title,
        //         created_at,
        //         closed_at,
        //         user,
        //         state,
        //         updated_at,
        //     };
        // });
        // result = sortArrayByAsc(result, "created_at");
        return response;
    };

    getWeeklyCommitActivity = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).getWeeklyCommitActivity);
        // let result = response.map((item) => {
        //     const date = item[0];
        //     const additions = item[1];
        //     const deletions = item[2];
        //     return {
        //         date: toDateTime(date),
        //         additions,
        //         deletions,
        //     };
        // });
        // result = sortArrayByAsc(result, "date");
        return response;
    };

    getLastYearCommitActivity = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).getLastYearCommitActivity);
        // let result = response.map((item) => {
        //     const total = item.total;
        //     const week = item.week;
        //     return {
        //         "total": total,
        //         "date": toDateTime(week),
        //     };
        // });
        // result = sortArrayByAsc(result, "date");
        return response;
    };

    getAllContributorCommitActivity = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).getAllContributorCommitActivity);
        // let result = response.map((item) => {
        //     const total = item.total;
        //     const weeks = item.weeks;
        //     const author = item.author.login;
        //     return {
        //         "total": total,
        //         "contributor": author, // left out weeks as of now
        //         // "weeks": weeks //
        //     };
        // });
        // result = sortArrayByAsc(result, "total", false);
        return response;
    };

    getWeeklyCommitCount = async (owner, repo) => {
        const response = await this.request(githubRESTMapFn(owner, repo).getWeeklyCommitCount);
        // const data = response.data;
        // const allTotal = data.all.reduce((x, y) => x + y, 0);
        // const ownerTotal = data.owner.reduce((x, y) => x + y, 0);
        // const exceptOwner = allTotal - ownerTotal;
        // return {
        //     allTotal,
        //     ownerTotal,
        //     exceptOwner
        // };
        return response;
    };

    getHourlyCommitCountForEachDay = async (owner, repo) => {
        const response = await this.request(githubRESTMapFn(owner, repo).getHourlyCommitCountForEachDay);
        console.log(response);
    };

    listOrganizationMembers = async (org) => {
        const response = await this.paginate(githubRESTMapFn(org).listOrganizationMembers);
        // let result = response.map((item) => {
        //     const member = item.login;
        //     return {
        //         member
        //     };
        // });
        return response;
    };

    listPullRequests = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listPullRequests);
        // let result = response.map((item) => {
        //     const state = item.state;
        //     const title = item.title;
        //     const user = item.user.login;
        //     const created_at = item.created_at.split("T")[0];
        //     const updated_at = handleNullSplit(item.updated_at);
        //     const closed_at = handleNullSplit(item.closed_at);
        //     const merged_at = handleNullSplit(item.merged_at);
        //     return {
        //         state,
        //         title,
        //         user,
        //         created_at,
        //         updated_at,
        //         closed_at,
        //         merged_at
        //     };
        // });
        // result = sortArrayByAsc(result, "created_at");
        return response;
    };

    listReleases = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listReleases);
        // let result = response.map((item) => {
        //     const author = item.author.login;
        //     const tag_name = item.tag_name;
        //     const name = item.name;
        //     const created_at = item.created_at.split("T")[0];
        //     const published_at = handleNullSplit(item.published_at);
        //     const html_url = item.html_url;
        //     return {
        //         author,
        //         tag_name,
        //         name,
        //         created_at,
        //         published_at,
        //     };
        // });
        // result = sortArrayByAsc(result, "published_at");
        return response;
    };

    listOrganisationRepositories = async (org) => {
        const response = await this.paginate(githubRESTMapFn(org).listOrganisationRepositories);
        // let result = response.map((item) => {
        //     const name = item.name;
        //     const html_url = item.html_url;
        //     const created_at = item.created_at.split("T")[0];
        //     return {
        //         name,
        //         html_url,
        //         created_at
        //     };
        // });
        // result = sortArrayByAsc(result, "created_at");
        return response;
    };

    listRepositoryContributors = async (owner, repo) => {
        const response = await this.paginate(githubRESTMapFn(owner, repo).listRepositoryContributors);
        // let result = response.map((item) => {
        //     const user = item.login;
        //     const contributions = item.contributions;
        //     return {
        //         user,
        //         contributions
        //     };
        // });
        // result = sortArrayByAsc(result, "contributions", false);
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
        // let result = response.map((item) => {
        //     const created_at = item.created_at.split("T")[0];
        //     const updated_at = handleNullSplit(item.updated_at);
        //     const pushed_at = handleNullSplit(item.pushed_at);
        //     const html_url = item.html_url;
        //     const login = item.owner.login;
        //     return {
        //         created_at,
        //         login,
        //         owner,
        //         updated_at,
        //         pushed_at,
        //     };
        // });
        // result = sortArrayByAsc(result, "created_at");
        return response;
    };
}

const octokit = new Octokit(new _Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN || "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"
}));

module.exports = { octokit };