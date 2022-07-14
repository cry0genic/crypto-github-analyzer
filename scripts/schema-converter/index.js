const jsonexport = require("jsonexport");
const fs = require("fs");

const convertSchemaToCSV = async (files) => {
    for (let index = 0; index < files.length; index++) {
        let file = files[index];
        file = file.split(".")[0];
        const schema = fs.readFileSync(`./schemas/${file}.json`);
        const csv = await jsonexport(JSON.parse(schema), {
            fillGaps: true,
            fillTopRow: true,
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
        fs.writeFileSync(`./csv-format/${file}.csv`, csv, "utf8");
    }

};

const readAllSchemas = async () => {
    const files = fs.readdirSync(`./schemas`, (err) => {
        if (err) return console.log(`${err} for directory at ${location}`);
    });;
    convertSchemaToCSV(files);
};

readAllSchemas();