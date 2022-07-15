const { Octokit } = require("octokit");
const fs = require("fs");
const crypto = require("crypto");
const { multiTokenAuth } = require("./create-multi-token-auth");
const { appendAndFormat, readFilesMetadata, toCSVFile } = require("./utils");

const dataConfig = {

    // Repository (snapshot)
    "repo_subscribers": {
        routeTemplate: "GET /repos/{owner}/{repo}/subscribers"
    },
    "repo_branches": {
        routeTemplate: "GET /repos/{owner}/{repo}/branches"
    },
    "repo_contributors": {
        routeTemplate: "GET /repos/{owner}/{repo}/contributors"
    },
    "repo_languages": {
        routeTemplate: "GET /repos/{owner}/{repo}/languages"
    },
    "repo_forks": {
        routeTemplate: "GET /repos/{owner}/{repo}/forks"
    },

    // Repository (time-series)
    "repo_commits": {
        routeTemplate: "GET /repos/{owner}/{repo}/commits",
        pagination_disabled: true
    },
    "repo_stars": {
        routeTemplate: "GET /repos/{owner}/{repo}/stargazers"
    },
    "repo_issues": {
        routeTemplate: "GET /repos/{owner}/{repo}/stargazers"
    },
    "repo_pulls": {
        routeTemplate: "GET /repos/{owner}/{repo}/pulls"
    },
    "repo_releases": {
        routeTemplate: "GET /repos/{owner}/{repo}/releases"
    },

    // Repository (stats)
    "repo_stats_code_frequency": {
        routeTemplate: "GET /repos/{owner}/{repo}/stats/code_frequency",
        resultHandler: (result) => {
            return result.map((item) => {
                const [date, additions, deletions] = item;
                return {
                    date,
                    additions,
                    deletions,
                };
            });
        }
    },
    "repo_stats_commit_activity": {
        routeTemplate: "GET /repos/{owner}/{repo}/stats/commit_activity"
    },
    "repo_stats_contributors": {
        routeTemplate: "GET /repos/{owner}/{repo}/stats/contributors"
    },
    "repo_stats_participation": {
        routeTemplate: "GET /repos/{owner}/{repo}/stats/participation"
    },
    "repo_stats_punch_card": {
        routeTemplate: "GET /repos/{owner}/{repo}/stats/punch_card"
    },

    // Org (snapshot)
    "org_members": {
        routeTemplate: "GET /orgs/{owner}/members"
    },
    "org_repos": {
        routeTemplate: "GET /repos/{owner}/repos"
    },
};


class GithubClient {
    constructor() {
        this.octokit = new Octokit({
            auth: [""],
            authStrategy: multiTokenAuth
        });
        this.octokit.hook.after("request", async (response, options) => {
            console.log(`ratelimit remaining - ${response.headers["x-ratelimit-remaining"]}`);
        });
    }

    buildRoute = (data, parameters, filesMetadata, page) => {
        page = page || (filesMetadata && filesMetadata.length > 0 && parseInt(filesMetadata.slice(-1)[0].page)) || 1;
        let route = dataConfig[data].routeTemplate;
        Object.keys(parameters).forEach((key) => {
            route = route.replace(`{${key}}`, parameters[key]);
        });
        if (dataConfig[data].pagination_disabled) {
            return route;
        }
        return `${route}${page ? `?page=${page}` : ''}`;
    };

    buildPaginateParameters = (data, filesMetadata) => {
        let paginateParameters = {
            headers: {
                "accept": "application/vnd.github.v3.star+json",
            },
            per_page: 100
        };
        if (data === "repo_commits" && filesMetadata.length === 1) {
            const { page: since, _ } = filesMetadata.slice(-1)[0];
            paginateParameters["since"] = decodeURIComponent(since);
            paginateParameters["until"] = new Date().toISOString();
        }

        if (data === "repo_commits" && filesMetadata.length === 0) {
            paginateParameters["until"] = new Date().toISOString();
        }
        return paginateParameters;
    };

    buildResponseHandler = (data, parameters, filesMetadata, dataDirectoryPath, outputHeaders) => {
        return async (response, done) => {

            const { ["x-ratelimit-remaining"]: rateLimitRemaining } = response.headers;

            // terminate if rate limit hit
            if (parseInt(rateLimitRemaining) < 2) {
                done();
            }

            if (data === "repo_commits") return response.data;

            // construct the file location
            const poppedFileMetadata = filesMetadata.slice(-1).pop();
            const { owner, repo } = parameters;
            const currentPage = parseInt(response.url.split("?page=")[1]) || 1;
            const dataHexDigest = crypto.createHash("sha256").update(JSON.stringify(response.data)).digest("hex");

            // No file in the directory (start saving) || Fresh page (not available in teh directory)
            if (poppedFileMetadata == undefined || currentPage > parseInt(poppedFileMetadata.page)) {
                const dataString = await appendAndFormat(owner, repo, response.data, outputHeaders);
                const fileName = `${currentPage}#${dataHexDigest}.csv`;
                const fileLocation = `${dataDirectoryPath}/${fileName}`;
                await toCSVFile(dataString, fileLocation, outputHeaders);
                console.log(`stored ${data} for ${owner}/${repo} - page ${currentPage} `);
                return;
            }

            console.log(`current: ${currentPage} | popped: ${poppedFileMetadata.page}`);

            // Delete the file if the ETag is not matching and move to the previous page
            if (dataHexDigest != poppedFileMetadata.hexDigest) {
                const newFilesMetadata = [...filesMetadata];
                const newPoppedFileMetadata = newFilesMetadata.pop();
                const { page, hexDigest: storedHexDigest } = newPoppedFileMetadata;
                const storedFileName = `${page}#${storedHexDigest}.csv`;
                const storedFileLocation = `${dataDirectoryPath}/${storedFileName}`;
                fs.unlinkSync(storedFileLocation);
                console.log(`removed ${data} for ${owner}/${repo} - page ${page} `);
                const prevPageRoute = this.buildRoute(data, parameters, newFilesMetadata, currentPage - 1);
                done();
                await this.octokit.paginate(prevPageRoute, this.buildPaginateParameters(data, filesMetadata), this.buildResponseHandler(data, parameters, newFilesMetadata, dataDirectoryPath, outputHeaders));

            }
        };
    };

    sync = async (data, syncOptions) => {
        const { parameters, dataDirectoryPath, outputHeaders } = syncOptions;
        const { owner, repo } = parameters;
        // fetch the files metadata (page & ETag)
        const filesMetadata = await readFilesMetadata(dataDirectoryPath);

        const route = this.buildRoute(data, parameters, filesMetadata);
        const paginateParameters = this.buildPaginateParameters(data, filesMetadata);
        const responseHandler = this.buildResponseHandler(data, parameters, filesMetadata, dataDirectoryPath, outputHeaders);

        if (data === "repo_commits") {
            // file does not exist
            if (filesMetadata.length === 0) {
                let result = []
                try {
                    result = await this.octokit.paginate(route, paginateParameters);
                } catch (error) {
                    if (error.message === "Not Found") {
                        return result;
                    }
                    console.error(`paginate failed for ${data} | ${JSON.stringify(parameters)}`, error);
                    throw error;
                }
                const fileLocation = `${dataDirectoryPath}/${encodeURIComponent(paginateParameters.until)}#NA.csv`;
                const dataString = await appendAndFormat(owner, repo, result, outputHeaders);
                await toCSVFile(dataString, fileLocation);
                console.log(`stored ${data} for ${owner}/${repo}`);
                return result;
            }
            // file exists
            if (filesMetadata.length === 1) {
                const { page: since, _ } = filesMetadata.slice(-1)[0];
                let result = []
                try {
                    result = await this.octokit.paginate(route, paginateParameters);
                } catch (error) {
                    if (error.message === "Not Found") {
                        return result;
                    }
                    console.error(`paginate failed for ${data} | ${JSON.stringify(parameters)}`, error);
                    throw error;
                }
                if (result.length === 0) {
                    console.log(`already up to date for ${data} of ${owner}/${repo}!`)
                    return;
                }
                const dataString = "\r\n" + (await appendAndFormat(owner, repo, result, outputHeaders)).split("repo\r\n")[1];
                // append to old file
                fs.appendFileSync(`${dataDirectoryPath}/${since}#NA.csv`, dataString);
                fs.renameSync(`${dataDirectoryPath}/${since}#NA.csv`, `${dataDirectoryPath}/${encodeURIComponent(paginateParameters.until)}#NA.csv`);
                return result;
            }
        }

        let result = [];
        try {
            result = await this.octokit.paginate(route, paginateParameters, responseHandler);
        } catch (error) {
            if (error.message === "Not Found") {
                return result;
            }
            console.error(`paginate failed for ${data} | ${JSON.stringify(parameters)}`, error);
            throw error;
        }

        // handle response if required 
        return (dataConfig[data].resultHandler && dataConfig[data].resultHandler(result)) || result;
    };
};

module.exports = new GithubClient();