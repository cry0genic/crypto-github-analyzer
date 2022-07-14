const fs = require("fs");
const jsonexport = require("jsonexport");

const toCSVFile = async (data, location, outputHeaders) => {
    try {
        const csv = await jsonexport(data, { 
            fillGaps: true, 
            fillTopRow: true, 
            headers: outputHeaders,
            typeHandlers: {
                String:(value, index, parent)=>{
                    if (encodeURI(value) != value) {
                        // stringify only when there is atleast one special character 
                        // and remove the outer double qutoes
                        return JSON.stringify(value).slice(1, -1)
                    }
                    return value
                }
            }
        });
        fs.writeFileSync(location, csv, "utf8");
    } catch (err) {
        console.error(`error while saving the CSV file (${location})`, err);
    }
};

const appendAndFormat = (owner, repo, response) => {
    if (response.map) {
        return response.map((obj) => {
            obj['owner'] = owner,
                obj['repo'] = repo;
            return obj;
        });        
    } else {
        const data = {
            owner,
            repo,
            ...response
        };
        return data;
    }
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

module.exports = { toCSVFile, appendAndFormat, readFilesMetadata };