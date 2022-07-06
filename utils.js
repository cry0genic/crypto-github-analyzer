const fs = require("fs");

const toDateTime = (secs) => {
    const date = new Date(secs * 1000).toISOString().split("T")[0];
    return date;
};

const sortArrayByAsc = (array, property, dateField = true) => {
    if (dateField == false) {
        let sortedArray = array.sort((a, b) => (a[`${property}`]) - (b[`${property}`]));
        sortedArray.forEach((item, id) => {
            item.id = id + 1;
        })
        return sortedArray;
    }
    let sortedArray = array.sort((a, b) => new Date(a[`${property}`]) - new Date(b[`${property}`]));
    sortedArray.forEach((item, id) => {
        item.id = id + 1;
    })
    return sortedArray;
};

const arrayToFile = (array, loc) => {
    const resp = JSON.stringify(array);
    fs.writeFileSync(loc, resp, "utf8");
};

const handleNullSplit = (date) => {
    if (date === null) {
        return "N/A"
    } else {
        return date.split("T")[0];
    };
};

module.exports = { toDateTime, arrayToFile, sortArrayByAsc, handleNullSplit };