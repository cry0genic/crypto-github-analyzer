const { BigQuery: _BigQuery } = require("@google-cloud/bigquery");

class BigQuery {
    constructor(bigQuery) {
        this.bigQuery = bigQuery;
    }
};

const bigQuery = new BigQuery(new _BigQuery());

module.exports = { bigQuery };