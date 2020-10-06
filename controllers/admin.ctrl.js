const { pool } = require ('../config');

const verifyUser = (req, res) => {
    const {
        userId
    } = req.params; // passed as prameter in URL eg 'https://fintech28.com/admin/verifyuser/userId=4', here 4 is the userId

    // check if user exists with given ID
    pool.query(`SELECT * FROM users WHERE id = $1`, [userId], (errGetUser, gotUser) => {
        if(errGetUser) throw errGetUser;
        if(gotUser.rows.length < 1) {
            return res.status(404).json({
                error: `User not found with id ${userId}`
            });
        }
        // user is found, update verification status
        pool.query(`UPDATE users SET isverified = $1 WHERE id = $2`, [true, userId], (errUpdateStatus, updatedStatus) => {
            if(errUpdateStatus) throw errUpdateStatus;
            res.status(201).json({
                message: 'User verification successful',
                data :{
                    email: gotUser.rows[0].email,
                    isverified: true
                }
            });
        });
    });
};

const seeAllUsers = (req, res) => {

    // select all users from database in order of id in descending manner
    pool.query(`SELECT * FROM users ORDER BY id DESC`, (errFetchUsers, allUsers) => {
        if(errFetchUsers) throw errFetchUsers;

        // initialize arrays for properties we want to see (hide password properties froom admin)
        let userEmails = [], userPhones = [], userBalances = [], userStatuses = [];

        // push user properties to previously initialized arrays
        allUsers.rows.forEach((user) => {
            console.log(user);
            userEmails.push(user.email);
            userPhones.push(user.phone);
            userBalances.push(user.balance);
            userStatuses.push(user.isverified);
        });

        // return data with populated arrays (these are in descending order of Id)
        res.status(200).json({
            message: 'Finteh28 users',
            data: {
                userEmails: userEmails,
                userPhones: userPhones,
                userBalances: userBalances,
                userStatuses: userStatuses
            }
        });
    });
};

const seeSingleUser = (req, res, next) => {
    const {
        userId
    } = req.params; // fetch from url

    // check if user exists with given Id
    pool.query(`SELECT * FROM users WHERE id = $1`, [userId], (errGetUser, gotUser) => {
        if(errGetUser) throw errGetUser;

        // if user does not yet exist, return error
        if(gotUser.rows.length < 1) {
            return res.status(404).json({
                error: `User not found with id ${userId}`
            });
        }

        // initialize variables with user properties we want to return
        const userEmail = gotUser.rows[0].email;
        const userPhone = gotUser.rows[0].phone;
        const userBalance = gotUser.rows[0].balance;
        const userStatus = gotUser.rows[0].isverified;

        // return user properties for admin
        res.status(200).json({
            message: 'Fintech28 user',
            data: {
                email :userEmail,
                phone: userPhone,
                balance: userBalance,
                isverified: userStatus
            }
        });
    });
};

module.exports = {
    verifyUser,
    seeAllUsers,
    seeSingleUser
}