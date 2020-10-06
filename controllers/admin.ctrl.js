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

module.exports = {
    verifyUser
}