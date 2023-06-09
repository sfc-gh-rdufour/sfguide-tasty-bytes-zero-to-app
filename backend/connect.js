/**************************************
 * 
 * connect.js
 * 
 * This file set's up the connection to
 * Snowflake using the environment var-
 * iables from the .env file
 * 
 **************************************/
const snowflake = require('snowflake-sdk');
const dotenv = require('dotenv');

// Enable environment variables in .env file
dotenv.config()

// 4.2.2 get connection details from environment variables

// 4.2.3 create the connection to the Snowflake account

module.exports = connection;