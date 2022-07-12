const fs = require("fs");
const jsonexport = require("jsonexport");


const splitGitHubURL = (url, org = false) => {
    if (org == true) {
        const organization = url.split("https://github.com/")[1];
        return organization;
    }
    const splitString = url.split("https://github.com/")[1];
    const [owner, repo] = splitString.split("/");
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

const toCSVFile = async (data, location) => {
    try {
        const csv = await jsonexport(data, { fillGaps: true, fillTopRow: true });
        fs.writeFileSync(location, csv, "utf8");
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
            ...response
        };
        return data;
    }
};

const handleFileSystemObject = async (location) => {
    if (!fs.existsSync(location)) {
        fs.mkdirSync(location);
        return [];
    }

    const files = fs.readdirSync(location, (err) => {
        if (err) return console.log(`${err} for directory at ${location}`);
    });;

    let result = files.map((file) => {
        const fileName = file.split(".csv")[0];
        const [page, etag] = fileName.split("#");
        return {
            page,
            etag
        };
    });
    return result.sort((a, b) => {
        return a.page - b.page;
    });
};

module.exports = { splitGitHubURL, getOwnerAndRepo, toCSVFile, appendAndFormat, handleFileSystemObject };