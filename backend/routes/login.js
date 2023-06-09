const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt')
var auth = require('../auth')

const connection = require('../connect.js')
var sql_queries = require('../sql')

router.post("/login", async (req, res) => {
    if(!req.body.name || !req.body.password ) {
        res.status(422).send("Incorrect data")
        return
    }

    const login_user = req.body.name
    const login_password = req.body.password
    connection.execute({
        sqlText: sql_queries.verify_user,
        binds: [login_user],
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Unable to validate user', err);
                res.status(500).json({ error: 'Unable to validate user' })
                return
            } else {
                if (rows.length == 0){
                    console.log('User does not exist: ' + login_user)
                    res.status(401).json('Invalid user or password')
                    return
                } else {
                    user_row = rows[0]
                    user_name = user_row.USER_NAME
                    hashed_password = user_row.HASHED_PASSWORD
                    franchise_id = user_row.FRANCHISE_ID                    
                    bcrypt.compare(login_password, hashed_password, function(err, result) {
                        if (err){
                            console.log('Failed to check password for: ' + login_user + ' - ' + err.message)
                            res.status(401).json('Invalid user or password')
                            return
                        }
                        if (result){
                            console.log('Successful login, generating token for: ' + user_name + ', franchise: ' + franchise_id)
                            const accessToken = auth.generateAccessToken({ user: req.body.name, franchise: franchise_id })
                            const refreshToken = auth.generateRefreshToken({ user: req.body.name, franchise: franchise_id })
                            res.json({ accessToken: accessToken, refreshToken: refreshToken })
                            return
                        }
                        console.log('Incorrect password for user: ' + login_user)
                        res.status(401).json('Invalid user or password')
                        return
                    });
                }
            }
        },
    });
});

router.post("/refresh", (req, res) => {
    if (!req.body.token)
        res.status(422).send("Incorrect data")
    if (!auth.refreshTokens.includes(req.body.token))
        res.status(400).send("Refresh Token Invalid")
    auth.refreshTokens = auth.refreshTokens.filter((c) => c != req.body.token)
    //remove the old refreshToken from the refreshTokens list
    const accessToken = auth.generateAccessToken({ user: req.body.token.user, franchise: req.body.token.franchise })
    const refreshToken = auth.generateRefreshToken({ user: req.body.token.user, franchise: req.body.token.franchise })
    //generate new accessToken and refreshTokens
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
});

module.exports = router;