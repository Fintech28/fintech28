const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user.ctrl');
const adminCtrl = require('../controllers/admin.ctrl');
const authUser = require('../controllers/authUser');

// POST & PATCH ENDPOINTS COME BEFORE GET ENDPOINTS

// user sign up and login
router.post('/api/v1/auth/create-user', userCtrl.createUser); // sign up
router.post('/api/v1/auth/login-user', userCtrl.loginUser); // log in

// user apply for loan
router.post('/api/v1/loan-application', authUser.authUserFn, userCtrl.userApplyForLoan);

// user deposit to account
router.post('/api/v1/deposit-to-account', authUser.authUserFn, userCtrl.userDepositToAccount);
// user withdraw from account
router.post('/api/v1/withdraw-from-account', authUser.authUserFn, userCtrl.userWithdrawFromAccount);
// user repay loan
router.patch('/api/v1/repay-loan/loanId=:loanId', authUser.authUserFn, userCtrl.userRepayLoan);

// admin verify user
router.patch('/api/v1/admin/verify-user/userId=:userId', adminCtrl.verifyUser);
// admin approve loan
router.patch('/api/v1/admin/approve-loan/loanId=:loanApplicationId', adminCtrl.reviewLoanApplication);

// get auth token user
router.get('/api/v1/logged-data', authUser.authUserFn, userCtrl.getLoggedUser);

// user check transaction logs
router.get('/api/v1/check-transaction-logs', authUser.authUserFn, userCtrl.userCheckTransactions);

// admin see all users
router.get('/api/v1/admin/users', adminCtrl.seeAllUsers);
// admin see single users
router.get('/api/v1/admin/users/userId=:userId', adminCtrl.seeSingleUser);

// admin see all loans
router.get('/api/v1/admin/loans', adminCtrl.seeAllLoans);

// user check balance
router.get('/api/v1/check-balance', authUser.authUserFn, userCtrl.checkBalance);
// user view all loan
router.get('/api/v1/see-loans', authUser.authUserFn, userCtrl.userSeeAllLoans);
// user view specific loan
router.get('/api/v1/see-loan/loanId=:loanId', authUser.authUserFn, userCtrl.userSeeSpecificLoan);

module.exports = router;