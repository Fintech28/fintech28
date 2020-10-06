const jwt = require('jsonwebtoken');

const { pool } = require('../config');

var user = {};

const authUserFn = (req, res, next) => {
    // add auth token to local variable
    const token = req.header('authorization');

    // check if token exists
    if(!token) {
        return res.status(403).json({
            error: 'No token provided'
        });
    }
    jwt.verify(token, process.env.secret_key, (err, decoded) => {
        // return error if unable to verify token
        if(err) {
            return res.status(401).json({
                error: 'Verification error'
            });
        }

        // assign token email to local variable
        const sessionuser = decoded.email;

        // create new user property with token email
        user.email = sessionuser;

        // check if user exists with token email
        pool.query(`SELECT * FROM users WHERE email = $1`, [sessionuser], (errGetUser, gotUser) => {
            if(errGetUser) throw errGetUser;
            
            // check if no user exists
            if(gotUser.rows.length < 1) {
                return res.status(404).json({
                    error: 'Invalid email. Retry your login'
                });
            }

            // otherwise authorize next middleware
            next();
        });
    });
};

module.exports = {
    authUserFn, user
};