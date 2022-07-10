const fs = require("fs");
const jsonexport = require("jsonexport");

const makeDirectory = (loc) => {
    if (!fs.existsSync(loc)) {
        fs.mkdirSync(loc, { recursive: true });
        return false;
    } else {
        return true;
    }
};

const splitGitHubURL = (url, org = false) => {
    if (org == true) {
        const organization = url.split("https://github.com/")[1];
        return organization;
    }
    const splitString = url.split("https://github.com/")[1];
    const owner = splitString.split("/")[0];
    const repo = splitString.split("/")[1];
    return {
        owner,
        repo
    };
};

const getOwnerAndRepo = (repository) => {
    const splitString = repository.split("/");
    const owner = splitString[0];
    const repo = splitString[1];
    return {
        owner,
        repo
    };
};

const toCSVFile = async (arg, loc) => {
    try {
        const csv = await jsonexport(arg, { fillGaps: true, fillTopRow: true });
        fs.writeFileSync(loc, csv, "utf8");
    } catch (err) {
        console.log("Error: ", err);
    }
};

const appendAndFormat = (owner, repo, response) => {
    if (response.map) {
        response.map((obj) => {
            obj['owner'] = owner,
                obj['repo'] = repo;
            return obj;
        });
        const data = JSON.stringify(response)
            .replaceAll("\\b", "\\\\b").replaceAll("\\f", "\\\\f").replaceAll("\\n", "\\\\n")
            .replaceAll("\\t", "\\\\t").replaceAll("\\v", "\\\\v").replaceAll("\\r", "\\\\r");
        return JSON.parse(data);

    } else {
        const data = {
            owner,
            repo,
            data: {
                ...response
            }
        };
        return data;
    }
};

module.exports = { makeDirectory, splitGitHubURL, getOwnerAndRepo, toCSVFile, appendAndFormat };