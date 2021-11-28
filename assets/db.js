"use strict";
const mysql2 = require('mysql2');
const { DBCONF } = require('./config');
const connection = mysql2.createConnection(DBCONF);
module.exports = {connection};