/**************************************
 * 
 * franchise.js
 * 
 * This file contains the endpoints that
 * should be built out with parsing the 
 * parameters and sending bound SQL queries
 * using the connection
 * 
 **************************************/
const express = require("express");
const router = express.Router();

const connection = require('../connect')
const auth = require('../auth')
const utils = require('../utils')
var sql_queries = require('../sql')

router.get('/:franchise/countries/', (req, res) => {
    // 4.3.2 Parse parameters and connect to Snowflake a return query response    
});

router.get('/:franchise/trucks/:truckbrandname/sales_topitems', (req, res) => {
    // 4.3.3 Parse parameters and connect to Snowflake a return query response
});

module.exports = router;