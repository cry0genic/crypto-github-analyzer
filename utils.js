const fs = require("fs");

const toDateTime = (secs) => {
    try {
        const date = new Date(secs * 1000).toISOString().split("T")[0];
        return date;
    } catch (e) {
        return "1970-01-01";
    }
};

const sortArrayByAsc = (array, property, dateField = true) => {
    if (dateField == false) {
        let sortedArray = array.sort((a, b) => (a[`${property}`]) - (b[`${property}`]));
        sortedArray.forEach((item, id) => {
            item.id = id + 1;
        });
        return sortedArray;
    }
    let sortedArray = array.sort((a, b) => new Date(a[`${property}`]) - new Date(b[`${property}`]));
    sortedArray.forEach((item, id) => {
        item.id = id + 1;
    });
    return sortedArray;
};

const arrayToFile = (array, loc) => {
    const resp = JSON.stringify(array);
    fs.writeFileSync(loc, resp, "utf8");
};

const handleNullSplit = (date) => {
    if (date === null || undefined) {
        return "N/A";
    } else {
        return date.split("T")[0];
    };
};

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

getOwnerAndRepo("maticnetwork/bor")

module.exports = { toDateTime, arrayToFile, sortArrayByAsc, handleNullSplit, makeDirectory, splitGitHubURL, getOwnerAndRepo };