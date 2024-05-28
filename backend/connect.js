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
const options = {
    account: process.env.ACCOUNT,
    username: process.env.USERNAME,
    authenticator: "SNOWFLAKE_JWT",
    privateKeyPath: "/Users/rdufour/Documents/github/app_user_rsa_key.p8",
    database: process.env.DATABASE,
    schema: process.env.SCHEMA,
    warehouse: process.env.WAREHOUSE,
};

// 4.2.3 create the connection to the Snowflake account
const connection = snowflake.createConnection(options);
connection.connect((err, conn) => {
    if (err) {
        console.error('Unable to connect to Snowflake', err);
    } else {
        console.log('Connected to Snowflake account ' + options.account);
    }
});

module.exports = connection;