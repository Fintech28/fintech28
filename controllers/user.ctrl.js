const { pool } = require ('../config');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

const authedUser = require('./authUser'); // jwt auth function

const authedProp = authedUser.user; // token email from jwt auth

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

                // create new token
                const token = jwt.sign({
                    email: email
                }, process.env.secret_key);

                // return success message
                res.status(200).json({
                    message: 'User sign up successful',
                    data: {
                        name: name,
                        email: email,
                        balance: 0,
                        isverified: false,
                        token: token
                    }
                });
            });
        });
    });
};

const loginUser = (req, res) => {
    const {
        email, password
    } = req.body;

    // check empty fields
    if(!email) {
        return res.status(409).json({
            error: 'Email is required'
        });
    }
    if(!password) {
        return res.status(409).json({
            error: 'Password is required'
        });
    }
    // end empty fields check

    // check if user exists in database
    pool.query(`SELECT * FROM users WHERE email = $1`, [email], (errGetUser, gotUser) => {
        if(errGetUser) throw errGetUser;

        // if no user exists, return error
        if(gotUser.rows.length < 1) {
            return res.status(404).json({
                error: 'User does not exist'
            });
        }

        // create token
        const token = jwt.sign({
            email: email,
        }, process.env.secret_key);
        res.status(200).json({
            message: 'Log in successful',
            data: {
                email: gotUser.rows[0].email,
                token: token
            }
        });
    });
};

const checkBalance = (req, res) => {

    // check whether user exists with email from token auth
    pool.query(`SELECT * FROM users WHERE email = $1`, [authedProp.email], (errGetLoggedUser, loggedUser) => {
        if(errGetLoggedUser) throw errGetLoggedUser;

        // return error if user doesn't exist
        if(loggedUser.rows.length < 1) {
            return res.status(404).json({
                error: 'Invalid email, retry your login'
            });
        }
        res.status(200).json({
            message: 'Your balance information',
            data: {
                email: loggedUser.rows[0].email,
                balance: loggedUser.rows[0].balance
            }
        });
    });
};

const userDepositToAccount = (req, res) => {
    const {
        amount
    } = req.body;
    
    // check for empty amount
    if(!amount) {
        return res.status(409).json({
            error: 'Amount is required'
        });
    }

    // check user data
    pool.query(`SELECT * FROM users WHERE email  =$1`, [authedProp.email], (errGetLoggedUser, loggedUser) => {
        if(errGetLoggedUser) throw errGetLoggedUser;
        if(loggedUser.rows.length < 1) {
            return res.status(404).json({
                error: 'Invalid email, retry your login'
            });
        }

        // calculate total balance now
        const newBalance = parseInt(loggedUser.rows[0].balance) + parseInt(amount);

        // save transaction then update user balance
        pool.query(`INSERT INTO transactions (byuserid, transactiontype, amount) VALUES ($1, $2, $3)`, [loggedUser.rows[0].id, 'Deposit', amount], (errAddTransaction, transactionAdded) => {
            if(errAddTransaction) throw errAddTransaction;
            pool.query(`UPDATE users SET balance = $1 WHERE id = $2`, [newBalance, loggedUser.rows[0].id], (errUpdateBal, balUpdated) => {
                if(errUpdateBal) throw errUpdateBal;

                // get currently completed transaction id
                pool.query(`SELECT currval ($1)`, ['transactions_id_seq'], (errgetCurrTransaction, currTransaction) => {
                    if(errgetCurrTransaction) throw errgetCurrTransaction;

                    // get whole row from currently completed transaction id
                    pool.query(`SELECT * FROM transactions WHERE id = $1`, [currTransaction.rows[0].currval], (errGetTransaction, transaction) => {
                        if(errGetTransaction) throw errGetTransaction;
                        res.status(201).json({
                            message: 'Deposit successful',
                            data: {
                                email: loggedUser.rows[0].email,
                                balance: newBalance,
                                time: transaction.rows[0].datetime
                            }
                        });
                    });
                });
            });
        });
    });
};

const userWithdrawFromAccount = (req, res) => {
    const {
        amount
    } = req.body;
    
    // check for empty amount
    if(!amount) {
        return res.status(409).json({
            error: 'Amount is required'
        });
    }

    // check user data
    pool.query(`SELECT * FROM users WHERE email  =$1`, [authedProp.email], (errGetLoggedUser, loggedUser) => {
        if(errGetLoggedUser) throw errGetLoggedUser;
        if(loggedUser.rows.length < 1) {
            return res.status(404).json({
                error: 'Invalid email, retry your login'
            });
        }

        // calculate total balance now
        const newBalance = parseInt(loggedUser.rows[0].balance) - parseInt(amount);
        if(newBalance < 0) {
            return res.status(409).json({
                error: `Balance cannot be less than zero. Your balance is ${loggedUser.rows[0].balance}`
            });
        }

        // save transaction then update user balance
        pool.query(`INSERT INTO transactions (byuserid, transactiontype, amount) VALUES ($1, $2, $3)`, [loggedUser.rows[0].id, 'Withdrawal', amount], (errAddTransaction, transactionAdded) => {
            if(errAddTransaction) throw errAddTransaction;
            pool.query(`UPDATE users SET balance = $1 WHERE id = $2`, [newBalance, loggedUser.rows[0].id], (errUpdateBal, balUpdated) => {
                if(errUpdateBal) throw errUpdateBal;

                // get currently completed transaction id
                pool.query(`SELECT currval ($1)`, ['transactions_id_seq'], (errgetCurrTransaction, currTransaction) => {
                    if(errgetCurrTransaction) throw errgetCurrTransaction;

                    // get whole row from currently completed transaction id
                    pool.query(`SELECT * FROM transactions WHERE id = $1`, [currTransaction.rows[0].currval], (errGetTransaction, transaction) => {
                        if(errGetTransaction) throw errGetTransaction;
                        res.status(201).json({
                            message: 'Withdrawal successful',
                            data: {
                                email: loggedUser.rows[0].email,
                                balance: newBalance,
                                time: transaction.rows[0].datetime
                            }
                        });
                    });
                });
            });
        });
    });
};

const userCheckTransactions = (req, res) => {
    pool.query(`SELECT * FROM users WHERE email = $1`, [authedProp.email], (errGetUser, gotUser) => {
        if(errGetUser) throw errGetUser;
        if(gotUser.rows.length < 1) {
            return res.status(404).json({
                error: 'Invalid email, retry your login'
            });
        }
        pool.query(`SELECT * FROM transactions WHERE byuserid = $1 ORDER BY id DESC`, [gotUser.rows[0].id], (errGetTransactions, gotTransactions)=> {
            if(errGetTransactions) throw errGetTransactions;
            if(gotTransactions.rows.length < 1) {
                return res.status(404).json({
                    error: 'No transactions for this user'
                });
            }
            res.status(200).json({
                message: 'Your transactions',
                transactions: gotTransactions.rows
            });
        });
    });
};

const userApplyForLoan = (req, res) => {
    const {
        amount
    } = req.body;

    // check if amount is empty
    if(!amount) {
        return res.status(409).json({
            error: 'Amount is required'
        });
    }
    pool.query(`SELECT * FROM users WHERE email = $1`, [authedProp.email], (errGetLoggedUser, loggedUser) => {
        if(errGetLoggedUser) throw errGetLoggedUser;
        if(loggedUser.rows.length < 1) {
            return res.status(404).json({
                error: 'Invalid email, retry your login'
            });
        }

        // check if user's account is verified by admin, otherwise prevent loan application
        if(loggedUser.rows[0].isverified === false) {
            return res.status(403).json({
                error: 'Your account is not yet verified by an admin'
            });
        }

        // we will use interest rate at 5% P.A just for example in our API. This can be changed later;
        const interestRate = 5;

        /*
        we will also initialize repayment period to one year for all loans below 100,000
        100,000 is also the minimum amount a user can borrow at a time.

        Specifications can be changed here in later refactorings
        */
       const maxAmount = 100000;
       const toRepayAfter = 12; // months

       // formula to calculate total interest to be reapid is PRINCIPAL * RATE * TIME
       // Principal is initialized to amount entered by user
       // check that amount is less than 100000
       if(parseInt(amount) > parseInt(maxAmount)) {
           return res.status(409).json({
            error: 'Amount must not be more than 100,000'
           });
       }
       const interestAccumulated = parseInt(amount) * parseInt(interestRate / 100) * parseInt(toRepayAfter);
       const totalToRepay = parseInt(interestAccumulated) + parseInt(amount);

       // add new loan request - unconfirmed

       const toPayBy = '2021-10-15'
       pool.query(`
       INSERT INTO loans 
       (byuserid, amount, isconfirmed, interestrate, totalrepaid, isfullyrepaid, monthsleft, dueon)
       VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8)`, [loggedUser.rows[0].id, amount, false, interestRate, 0, false, 12, toPayBy], (errAddLoanReq, loanReq) => {
           if(errAddLoanReq) throw errAddLoanReq;
           res.status(201).json({
               message: 'Application received',
               data: {
                   email: loggedUser.rows[0].email,
                   amount: amount,
                   toBePaidby: toPayBy
               }
           });
       });
    });
};

module.exports = {
    createUser,
    loginUser,
    checkBalance,
    userDepositToAccount,
    userWithdrawFromAccount,
    userCheckTransactions,
    userApplyForLoan
};