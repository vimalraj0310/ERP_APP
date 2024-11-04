const sql = require('mssql');
const config = require('./config');

const db = new sql.ConnectionPool(config);

module.exports = db;
