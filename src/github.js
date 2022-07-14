const { Octokit } = require("octokit");
const fs = require("fs");
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
        routeTemplate: "GET /repos/{owner}/{repo}/commits"
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
}


class GithubClient {
    constructor() {
        this.octokit = new Octokit({
            auth: [""],
            authStrategy: multiTokenAuth
        })
        this.octokit.hook.after("request", async (response, options) => {
            console.log(`ratelimit remaining - ${response.headers["x-ratelimit-remaining"]}`)
        })
    }

    buildRoute = (data, parameters, filesMetadata, page) => {
        page = page || (filesMetadata && filesMetadata.length > 0 && parseInt(filesMetadata.slice(-1)[0].page)) || 1
        let route = dataConfig[data].routeTemplate;
        Object.keys(parameters).forEach((key) => {
            route = route.replace(`{${key}}`, parameters[key])
        })
        return `${route}${page ? `?page=${page}` : ''}`
    }

    buildPaginateParameters = (data) => {
        return {
            headers: {
                "accept": "application/vnd.github.v3.star+json",
            },
            per_page: 100
        }
    }

    buildResponseHandler = (data, parameters, filesMetadata, dataDirectoryPath, outputHeaders) => {
        return async (response, done) => {
            const { etag, ["x-ratelimit-remaining"]: rateLimitRemaining } = response.headers;

            // terminate if rate limit hit
            if (parseInt(rateLimitRemaining) < 2) {
                done();
            }

            // construct the file location
            const currentPage = parseInt(response.url.split("?page=")[1]) || 1;
            const etagString = etag.split('"')[etag.split('"').length - 2];
            const fileName = `${currentPage}#${etagString}.csv`;
            const fileLocation = `${dataDirectoryPath}/${fileName}`
            
            let poppedFileMetadata = filesMetadata.slice(-1).pop();
            const { owner, repo } = parameters;

            // No file in the directory (start saving) || Fresh page (not available in teh directory)
            if (poppedFileMetadata == undefined || currentPage != parseInt(poppedFileMetadata.page)) {
                const formattedData = appendAndFormat(owner, repo, response.data);
                await toCSVFile(formattedData, fileLocation, outputHeaders);
                console.log(`stored ${data} for ${owner}/${repo} - page ${currentPage} `)
                return
            }

            // Delete the file if the ETag is not matching and move to the previous page
            if (etagString != poppedFileMetadata.etag) {
                poppedFileMetadata = filesMetadata.pop();
                const {page, etag: storedTag} = poppedFileMetadata;
                const storedFileName = `${page}#${storedTag}.csv`;
                const storedFileLocation = `${dataDirectoryPath}/${storedFileName}`
                fs.unlink(storedFileLocation, (err) => {
                    if (err) {
                        console.error(`error while removeing the file (${fileLocation})`, err)
                        done()
                    };
                });
                console.log(`removed ${data} for ${owner}/${repo} - page ${page} `)
                const prevPageRoute = this.buildRoute(data, parameters, filesMetadata, currentPage - 1)
                await this.octokit.paginate(prevPageRoute, this.buildPaginateParameters(data), this.buildResponseHandler(data, parameters, filesMetadata, dataDirectoryPath, outputHeaders))
                done()                
            }
        }
    }

    sync = async (data, syncOptions) => {
        const { parameters, dataDirectoryPath, outputHeaders } = syncOptions;

        // fetch the files metadata (page & ETag)
        const filesMetadata = await readFilesMetadata(dataDirectoryPath);

        const route = this.buildRoute(data, parameters, filesMetadata)
        const paginateParameters = this.buildPaginateParameters(data)
        const responseHandler = this.buildResponseHandler(data, parameters, filesMetadata, dataDirectoryPath, outputHeaders)

        const result = await this.octokit.paginate(route, paginateParameters, responseHandler)
        
        // handle response if required 
        return (dataConfig[data].resultHandler && dataConfig[data].resultHandler(result)) || result
    }
};

module.exports = new GithubClient()