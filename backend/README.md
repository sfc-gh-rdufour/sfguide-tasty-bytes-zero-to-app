# Zero to App Workshop - Building the Backend API

In this part of the Workshop we will set up the Backend for the application, which will be an API that will server the Frontend UI. This backend will connect to the Snowflake database created earlier.

The backend will be using [Node Express](https://expressjs.com/), a small web framework for **Node.js**

The different parts of the API that we will implement are:
* Connection to Snowflake
* API http routes to serve the requests
* Authentication in the form of JWT based tokens

## Set up the node express backend

### Check that you have Node.js and NPM installed
The first step is to install the pre-requisites to build and run a Node application.

Open a terminal (or shell, or command prompt), and check that you have Node installed:
```shell
$ npm -v
9.5.0

$ node -v
v18.14.2
```
If you get an error here, make sure you have both installed properly, following the official guide [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Create a new project using the Node Express Generator
Use the Node Express Generator to bootstrap the project
````shell
$ npm install -g express-generator
...

$ npm install express --save
...
````

This should give you a boiler plate project for the Node Express backend. In the main folder that was created, you can now add the main app file that we will call ```app.js```. Add the following content to it:
````js
const express = require('express');

// Create a new Express app
const app = express();

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
````
This will create a basic (but empty) application running on port 3000. You can test this by calling 
````sh
$ node app.js
Server running on port 3000
````

## Add the connection to Snowflake

The first thing we should add to the application is a connection to Snowflake so we can start retrieving the data from the database.

Install the [Snowflake Driver for Node.js](https://docs.snowflake.com/developer-guide/node-js/nodejs-driver):
````sh
npm install snowflake-sdk
````
* [Snowflake Documentation: Installing the Node.js Driver](https://docs.snowflake.com/en/user-guide/nodejs-driver-install)
* [NPM package](https://www.npmjs.com/package/snowflake-sdk)

Add the requirement for Snowflake driver in the main ```app.js```, by adding the following line to the top of the file:
```js
const snowflake = require('snowflake-sdk');
```

### Authenticate a user against Snowflake
We now need to create a user in the Snowflake account that the API will connect as. We will use Key Pair authentication [Snowflake docs - Key Pair Authentication](https://docs.snowflake.com/en/user-guide/key-pair-auth)

Start by generating a private and a public key to associate with the user
````sh
$ openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out app_user_rsa_key.p8 -nocrypt
Generating RSA private key, 2048 bit long modulus (2 primes)
...

$ openssl rsa -in app_user_rsa_key.p8 -pubout -out app_user_rsa_key.pub
writing RSA key
````
This will generate two keys in your folder, a private key and a public key.

*Note, make sure that you don't commit these files to your code repository. If you are using git you should make sure to ignore them in commits. You can do that by adding a line to the `.gitignore` file:*
```yaml
# Keys
*.p8
*.pub
```

Now take a note of the public key contents. Copy the content between the header and footer only, and remove the linebreaks.
```sh
$ cat app_user_rsa_key.pub | tr -d "\n" | sed -r "s/-{5}[A-Z ]*-{5}//g"
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmT/
....
....
+SWsODZKAhqU8PRAqlXhIQIDAQAB
```

Now we can create this user in the Snowflake account. Log into the Snowflake account, make sure you are in a role that has permissions to create users, like `ACCOUNT_ADMIN`.

Replace the `RSA_PUBLIC_KEY` value with what you just copied from the generated _public_ key:
```sql
CREATE ROLE TASTY_APP_API_ROLE;

GRANT USAGE ON DATABASE FROSTBYTE_TASTY_BYTES TO ROLE TASTY_APP_API_ROLE;
GRANT USAGE ON SCHEMA FROSTBYTE_TASTY_BYTES.APP TO ROLE TASTY_APP_API_ROLE;
GRANT SELECT ON ALL TABLES IN SCHEMA FROSTBYTE_TASTY_BYTES.APP TO ROLE TASTY_APP_API_ROLE;
GRANT SELECT ON FUTURE TABLES IN SCHEMA FROSTBYTE_TASTY_BYTES.APP TO ROLE TASTY_APP_API_ROLE;
GRANT USAGE ON WAREHOUSE APP_WH TO ROLE TASTY_APP_API_ROLE;

CREATE USER IF NOT EXISTS tasty_app_api_user
    PASSWORD = NULL
    LOGIN_NAME = 'tasty_app_api_user'
    DISPLAY_NAME = 'Tasty App API user'
    FIRST_NAME = 'Tasty App API user'
    LAST_NAME = 'Tasty App API user'
    MUST_CHANGE_PASSWORD = FALSE
    DISABLED = FALSE
    DEFAULT_WAREHOUSE = APP_WH
    DEFAULT_NAMESPACE = FROSTBYTE_TASTY_BYTES.APP
    DEFAULT_ROLE = TASTY_APP_API_ROLE
    RSA_PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0.......NhjoKkBYKh/YdZ9UiOStZrBBXmJkrDXAxaEObEnbwIDAQAB'
    COMMENT = 'API user for Tasty App';

GRANT ROLE TASTY_APP_API_ROLE TO USER tasty_app_api_user;
```

Going back to the `app.js` file, add the credentials for the connection to the Snowflake account after the initial requirements:
````js
const options = {
    account: "{ACCOUNT}",
    username: "tasty_app_api_user",
    authenticator: "SNOWFLAKE_JWT",
    privateKeyPath: "app_user_rsa_key.p8",
    database: "FROSTBYTE_TASTY_BYTES",
    schema: "APP",
    warehouse: "APP_WH",
};
````
Replace `{ACCOUNT}` with the identifier for your Snowflake account, you can grab it by running in your Snowflake UI:
```sql
SELECT current_account();
```

We will later on replace the values here with values imported from the ENVIRONMENT variables, making it easier to deploy this application in there environments without having to hard code the secrets in the code.

For more details on how to connect with key pair authentication in Node.js, the official documentation goes through the details:
[Snowflake docs - https://docs.snowflake.com/en/user-guide/nodejs-driver-use](https://docs.snowflake.com/en/user-guide/nodejs-driver-use#label-nodejs-key-pair-authentication)

We can now connect using these credentials. In `app.js`, add the following to the end of the file:
````js
// Create a new Snowflake connection
const connection = snowflake.createConnection(options);

// Connect to Snowflake
connection.connect((err, conn) => {
    if (err) {
        console.error('Unable to connect to Snowflake', err);
    } else {
        console.log('Connected to Snowflake');
    }
});
````

We can now try that the app runs and connects to Snowflake using the credentials:
```sh
$ node app.js
Server running on port 3000
Connected to Snowflake
```

Now we should move the connection details to an environment variable file to make it more portable and easier to manage. Start by adding the package for `dotenv` to the project:

```sh
$ npm install dotenv
```
And then add the requirement at the top of the `app.js` file:
```js
const dotenv = require('dotenv');
```

Add a separate file to the root of your folder, name it `.env` and add the details for the Snowflake connection there (again, make sure to replace `{ACCOUNT}` with yoour actual account name):
```sh
ACCOUNT={ACCOUNT}
USERNAME=tasty_app_api_user
DATABASE=FROSTBYTE_TASTY_BYTES
SCHEMA=APP
WAREHOUSE=APP_WH
```
In the `app.js` code we can now replace the connection configuration with:
```js
const options = {
    account: process.env.ACCOUNT,
    username: process.env.USERNAME,
    authenticator: "SNOWFLAKE_JWT",
    privateKeyPath: "app_user_rsa_key.p8",
    database: process.env.DATABASE,
    schema: process.env.SCHEMA,
    warehouse: process.env.WAREHOUSE,
};
```
This also means that none of the sensitive details are checked into source control.

*Note, make sure that you don't commit the environment variable file to your code repository. If you are using git you should make sure to ignore them in commits. You can do that by adding a line to the `.gitignore` file:*
```yaml
# environment variables file
.env
```

### Making a request that connects to Snowflake
We can now make a request in an API route with the connection. At the end of `app.js` add the following code that defines a new http route:
````js
app.get("/", (req, res, next) => {

    connection.execute({
        sqlText: `
        SELECT ARRAY_AGG(DISTINCT franchise_role) as franchise_roles
        FROM app.orders
        JOIN app.app_security on app.orders.franchise_id = app.app_security.franchise_id;
        `,
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Unable to retrieve franchises', err);
                res.status(500).json({ error: 'Unable to retrieve franchises' });
            } else {
                res.json(rows);
            }
        },
    });
});
````

Test out the new route by starting the backend again:
```sh
$ node app.js
```
And in a separate terminal, call running app:
```sh
$ curl localhost:3000/
[{"FRANCHISE_ROLES":["ACCOUNTADMIN","FRANCHISE_1","FRANCHISE_120","FRANCHISE_271"]}]
```

## Building out the API

We can now add additional routes to the API to serve the different requests from the Frontend.

The different routes we will add are:
| Route | Method | Filters |
| ------- | --------- | ------- |
| / | Return a list of all the franchise roles (only used to test the API) |
| /franchise/:franchise/countries | Returns a top 10 countries by sales for the specified franchise | |
| /franchise/:franchise/trucks | Returns a top 10 trucks by sales for the specified franchise | startdate and enddate |
| /franchise/:franchise/revenue/:year | Return the revenue for the specified year and truck |
| /franchise/:franchise/trucks/:truckbrandname/sales | Returns the top selling items by truck brand for a specified franchise. By adding a ?analysis=(topitems,dayofweek,topitems_dayofweek) different views of the data is returned | startdate and enddate |
| /franchise/:franchise/trucks/:truckbrandname/locations | Returns the top 10 locations for a truck brand for a specified franchise | startdate and enddate |

The routes can be filtered by adding `?start=2023-01-01&end=2023-03-01` as optional querystring parameters.

Start by adding the route definitions to the end of the `app.js` file:
```js

app.get('/franchise/:franchise/countries/', (req, res) => {
    console.log(req.path);
    res.status(200).json('Success - ' + req.path);
});

app.get('/franchise/:franchise/trucks/', (req, res) => {
    console.log(req.path);
    res.status(200).json('Success - ' + req.path);
});

app.get('/franchise/:franchise/revenue/:year(\\d{4})', (req, res) => {
    console.log(req.path);
    res.status(200).json('Success - ' + req.path);
});

app.get('/franchise/:franchise/trucks/:truckbrandname/sales', (req, res) => {
    console.log(req.path);
    res.status(200).json('Success - ' + req.path);
});

app.get('/franchise/:franchise/trucks/:truckbrandname/locations', (req, res) => {
    console.log(req.path);
    res.status(200).json('Success - ' + req.path);
});
```

Test it out by starting the backend again:
```sh
$ node app.js
```
And in a separate terminal, call running app:
```sh
$ curl localhost:3000/franchise/1/trucks
"Success - /franchise/1/trucks"
```



## Securing the API

Generate a ACCESS_TOKEN_SECRET and a REFRESH_TOKEN_SECRET used to sign the JWTs:
```shell
$ node
> require("crypto").randomBytes(64).toString("hex")
// This will generate a RANDOM string, you can cut paste this string in the .env file
```
Do this twice and put each into the ```.env``` file
```yaml
ACCESS_TOKEN_SECRET=0b5191c5..............950b77c4d98075dba87bdb6c5bb
REFRESH_TOKEN_SECRET=b8f994547.............bef23e61ab9888fccb061ba9f4
```

Create a table in the database to hold the users:
```sql
CREATE OR REPLACE TABLE USERS ( 
    USER_ID NUMBER(38,0) AUTOINCREMENT(1,1), 
    USER_NAME VARCHAR(16777216), 
    HASHED_PASSWORD VARCHAR(16777216), 
    FRANCHISE_ID NUMBER(38,0), 
    PASSWORD_DATE TIMESTAMP_NTZ(9), 
    STATUS BOOLEAN);
```

We can now create a simpole routine that let's us create users directly in the database. Add a file and call it `user.js` and add the code:
```js
const snowflake = require('snowflake-sdk');
const dotenv = require('dotenv');
var sql_queries = require('./sql')
const bcrypt = require('bcrypt')

dotenv.config();

const options = {
    account: process.env.ACCOUNT,
    username: process.env.USERNAME,
    authenticator: "SNOWFLAKE_JWT",
    privateKeyPath: "app_user_rsa_key.p8",
    database: process.env.DATABASE,
    schema: process.env.SCHEMA,
    warehouse: process.env.WAREHOUSE,
};

// Create a new Snowflake connection
const connection = snowflake.createConnection(options);

// Connect to Snowflake
connection.connect((err, conn) => {
    if (err) {
        console.error('Unable to connect to Snowflake', err);
    } else {
        console.log('Connected to Snowflake');
    }
});

async function createUser(user_name, franchise, password) {
    const hashedPassword = await bcrypt.hash(password, 10)
    connection.execute({
        sqlText: sql_queries.insert_user,
        binds: [user_name, hashedPassword, franchise],
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Unable to save user', err);                
            } else {
                console.log("Successfully created user " + user_name)
            }
        },
    });
}

user = Object.fromEntries(process.argv.map(x => x.split('=')).filter(x => x.length>1))
createUser(user.user_name, user.franchise, user.password)
```
In the `package.json` file we can now add a separate script to manually create a user:
```json
"scripts": {
    "start": "node app.js",
    "create_user": "node user.js"
  },
```

We can now call this to create a new user in the database
```shell
$ npm run create_user user_name=user1 franchise=1 password=password1
Successfully created user user1
$ npm run create_user user_name=user2 franchise=120 password=password120
Successfully created user user2
$ npm run create_user user_name=user3 franchise=271 password=password271
Successfully created user user3
```

Now in the database, we can inspect the user created after this call:
```sql
SELECT * FROM USERS;
```
| USER_ID | USER_NAME | HASHED_PASSWORD | FRANCHISE_ID | PASSWORD_DATE | STATUS |
| ------- | --------- | --------------- | ------------ | ------------- | ------ |
| 1	| user1	| $2b$10$3/teX....iH7NI1SjoTjhi74a	| 1	| 2023-04-24 08:27:53.695	 | TRUE |
| 2	| user2	| $2b$10$9wdGi....U8qeK/nX3c9HV8VW	| 120	| 2023-04-24 08:27:59.805	 | TRUE |
| 3	| user3	| $2b$10$CNZif....IXZFepwrGtZbGqIO	| 271	| 2023-04-24 08:28:05.792	 | TRUE |

If we want to allow or disallow a user to login, change the `STATUS` column:
```sql
UPDATE USERS SET STATUS=FALSE WHERE USER_ID = 'user3';
```

Now we can use those users to login and get an AccessToken:
```shell
curl -X POST http://localhost:3000/login -H 'Content-Type:application/json' -d '{"name":"user2","password":"password120"}'
```

You can inspect the JWT tokens using [JWT.io](JWT.io), paste it in and inspect the payload. It should contain something like this:
```json
{
  "user": "MY_USER_NAME",
  "franchise": "FRANCHISE_ID",
  "iat": 1681417090,
  "exp": 1681418290
}
```

Getting a new token using the refreshtoken:
```shell
curl -X POST http://localhost:3000/refreshToken -H 'Content-Type:application/json' -d '{"token":"REFRESH_TOKEN"}'
```


Calling an API route with the token:
```shell
curl http://localhost:3000/ -H "Accept: application/json" -H "Authorization: Bearer {ACCESS_TOKEN}"
curl http://localhost:3000/ -H "Accept: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZnJlZCIsImZyYW5jaGlzZSI6IkZSQU5DSElTRV8xIiwiaWF0IjoxNjgxNDE3MDkwLCJleHAiOjE2ODE0MTc5OTB9.GuEsNHEPtN3gSeA6dCMVMyueRW_jwdGceiHArwUcaA8
```


Adding CORS to the backend, to allow the Frontend to call it from another server.
Install CORS package for Node Express [https://expressjs.com/en/resources/middleware/cors.html](Node Express CORS middleware):
```sh
npm install cors                                                            
```

Add it as a requirement in `app.js` at the top:
```js
const cors = require('cors');
```
And before we start the server in the code, add:
```js
app.use(cors({
    origin: ['http://localhost:3001']
}));

app.use(express.json())
```

Where `http://localhost:3001` is the URL of the frontend that you are running

## Environment variables
An example of a final .env file:
```sh
ACCOUNT=account_name
USERNAME=service_user_name
PASSWORD=secret_pa$$word
DATABASE=FROSTBYTE_TASTY_BYTES
SCHEMA=RAW_POS
WAREHOUSE=TASTY_DATA_APP_WH

ACCESS_TOKEN_SECRET=0b5191c5f9257c3999.................................................................................................dba87bdb6c5bb
REFRESH_TOKEN_SECRET=b8f994547e66fa6cec.................................................................................................8fccb061ba9f4

PORT=3000
CORS_ADDRESS=http://localhost:3001
NODE_ENV=development
DEV_AUTH_USER=user1
DEV_AUTH_FRANCHISE=1
```

## Securing the communication - https

```sh
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```

```sh
Backend
	/cert.pem
	/csr.pem
	/app.js
	/key.pem
	/package-lock.json
	/package.json
```

```js
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
```


[https://adamtheautomator.com/https-nodejs/](https://adamtheautomator.com/https-nodejs/)