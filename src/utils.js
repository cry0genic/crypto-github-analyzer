const fs = require("fs");
const jsonexport = require("jsonexport");

const toCSVFile = async (dataString, location) => {
    try {
        fs.writeFileSync(location, dataString, "utf8");
    } catch (err) {
        console.error(`error while saving the CSV file (${location})`, err);
    }
};

const appendAndFormat = async (owner, repo, response, outputHeaders) => {
    let data;
    if (response.map) {
        data = response.map((obj) => {
            obj['owner'] = owner,
                obj['repo'] = repo;
            return obj;
        });
    } else {
        data = {
            owner,
            repo,
            ...response
        };
    }
    const dataString = await jsonexport(data, {
        fillGaps: true,
        fillTopRow: true,
        headers: outputHeaders,
        typeHandlers: {
            String: (value, index, parent) => {
                if (encodeURI(value) != value) {
                    // stringify only when there is atleast one special character 
                    // and remove the outer double qutoes
                    return JSON.stringify(value).slice(1, -1);
                }
                return value;
            }
        }
    });
    return dataString;
};

const readFilesMetadata = async (location) => {
    if (!fs.existsSync(location)) {
        fs.mkdirSync(location, {
            recursive: true
        });
        return [];
    }

    const files = fs.readdirSync(location, (err) => {
        if (err) return console.log(`${err} for directory at ${location}`);
    });;

    let result = files.map((file) => {
        const fileName = file.split(".csv")[0];
        const [page, hexDigest] = fileName.split("#");
        return {
            page,
            hexDigest
        };
    });
    return result.sort((a, b) => {
        return a.page - b.page;
    });
};

module.exports = { toCSVFile, appendAndFormat, readFilesMetadata };