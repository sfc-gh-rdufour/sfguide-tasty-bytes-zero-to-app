/**************************************
 * 
 * app.js
 * 
 * Main Node Express app file that sets
 * up the server, defines the routes and
 * adds additional routes defined in files
 * from /routes folder
 * 
 **************************************/
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 4.2.1 Set up the connection to Snowflake
var connection = require('./connect.js')

// 4.2.4 Definition of sql queries to execute
var sql_queries = require('./sql')

// Helpers for parsing dates and loggin requests
var utils = require('./utils')

const login = require('./routes/login.js')

// Create a new Express app
const app = express();

// Enable environment variables in .env file
dotenv.config()

// 4.5.1 add CORS to the app

// Start the server
const port = 3000
app.listen(port, () => {
    console.log("Server running on port " + port);
});

// Add additional middleware (json response output, request logging )
app.use(express.json())
app.use(utils.logRequest);

// 4.4.2 Add helpers for authenetication and tokens
// 4.4.3 Add routes for login
// 4.4.4 Add validation of tokens to each route

// Definition of first route
app.get("/", (req, res, next) => {
    console.log(req.method + ': ' + req.path);
    // 4.2.3 Connect to Snowflake and return query result
    connection.execute({
        sqlText: sql_queries.all_franchise_names,
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Unable to retrieve franchises', err);
                res.status(500).json({ error: 'Unable to retrieve franchises' });
            } else {
                res.status(200).json(rows);
            }
        },
    });
});

// 4.3.1 Add franchise routes
const franchise = require('./routes/franchise.js')
app.use("/franchise", franchise);

// 4.3.6 Add remaining franchise routes
const franchise_all = require('./routes/franchise_all.js')
app.use("/franchise", franchise_all);