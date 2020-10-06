const { pool } = require ('../config');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

const createUser = (req, res) => {
    const {
        name, email, phone, password
    } = req.body;
    // check empty fields
    if(!name) {
        return res.status(409).json({
            error: 'Name is required'
        });
    }
    if(!email) {
        return res.status(409).json({
            error: 'Email is required'
        });
    }
    if(!phone) {
        return res.status(409).json({
            error: 'Phone is required'
        });
    }
    if(!password) {
        return res.status(409).json({
            error: 'Password is required'
        });
    }
    // end empty fields check

    // check if user already exists with email or phone
    pool.query(`SELECT * FROM users WHERE email = $1 OR phone = $2`, [email, phone], (errCheckUser, foundMatch) => {
        if(errCheckUser) throw errCheckUser;
        if(foundMatch.rows.length > 0) {
            return res.status(409).json({
                error: 'Email or phone already exists'
            });
        }
        // end normalization check

        // hash password
        bcrypt.hash(password, 12, (errHashing, hash) => {
            if(errHashing) throw errHashing;

            // add user to database with hash
            pool.query(`INSERT INTO USERS (name, email, phone, password, isverified, balance) VALUES ($1, $2, $3, $4, $5, $6)`, [name, email, phone, hash, false, 0], (errAddUser, addedUser) => {
                if(errAddUser) throw errAddUser;

                // return success message
                res.status(200).json({
                    message: 'Added user successfully'
                });
            });
        });
    });
};

module.exports = {
    createUser
};