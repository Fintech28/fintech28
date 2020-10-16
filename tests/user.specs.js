const chai = require('chai');

const chaiHttp = require('chai-http');

const userModel = require('../models/user.models');

const server = require('../server');

const { pool } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;

var token = '';

beforeEach('before tests', (done) => {
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNsYXVkQG1haWwuY29tIiwiaWF0IjoxNjAyODUyMDQ4fQ.tY8z2FEBPlYS8hKb9j8Dz24ZtI96B4IFgHEP4p_m0BI';
  done();
});

afterEach('after all tests', (done) => {
  token = '';
  pool.query(`DELETE FROM users WHERE email = $1`, [userModel.userFour.email], (err, re) => {
    if(err) throw err;
  });
  done();
});

describe('create user', () => {

  before('after all tests', (done) => {
    pool.query(`DELETE FROM users WHERE email = $1`, [userModel.userFour.email], (err, re) => {
      if(err) throw err;
    });
    pool.query(`UPDATE loans SET totaltorepay = 100 WHERE id = 2`, (err, re) => {
      if(err) throw err;
    });
    done();
  });
    
    it('should check name is available', (done) => {
      chai.request(server)
      .post('/api/v1/auth/create-user')
      .send(userModel.userOne1)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
    
    it('should check email is available', (done) => {
      chai.request(server)
      .post('/api/v1/auth/create-user')
      .send(userModel.userOne2)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
    
    it('should check phone is available', (done) => {
      chai.request(server)
      .post('/api/v1/auth/create-user')
      .send(userModel.userOne3)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
    
    it('should check password is available', (done) => {
      chai.request(server)
      .post('/api/v1/auth/create-user')
      .send(userModel.userOne4)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });

    it('should check email is valid', (done) => {
      chai.request(server)
      .post('/api/v1/auth/create-user')
      .send({
        name: 'Claud',
        email: 'claudmailer.test',
        phone: '+254705724562',
        password: 'mypassword'
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
    
    it('should check phone is valid', (done) => {
      chai.request(server)
      .post('/api/v1/auth/create-user')
      .send({
        name: 'Claud',
        email: 'claud@mailer.test',
        phone: '0705724562',
        password: 'mypassword'
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });

    it('should check if user already exists', (done) => {
      chai.request(server)
      .post('/api/v1/auth/create-user')
      .send(userModel.userThree)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(403);
        expect(res).to.be.a('object');
        done();
      });
    });

    it('should sign up user', (done) => {
        chai.request(server)
        .post('/api/v1/auth/create-user')
        .send(userModel.userFour)
        .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(201);
            expect(res).to.be.a('object');
            done();
      });
    });

});

describe('login user', () => {

    it('should check email is available', (done) => {
      chai.request(server)
      .post('/api/v1/auth/login-user')
      .send(userModel.userFive)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
    
    it('should check password is available', (done) => {
      chai.request(server)
      .post('/api/v1/auth/login-user')
      .send(userModel.userSix)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
    
    it('should check email is correct', (done) => {
      chai.request(server)
      .post('/api/v1/auth/login-user')
      .send(userModel.userEight)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(404);
        expect(res).to.be.a('object');
        done();
      });
    });
    
    it('should check password is correct', (done) => {
      chai.request(server)
      .post('/api/v1/auth/login-user')
      .send(userModel.userSeven)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(403);
        expect(res).to.be.a('object');
        done();
      });
    });

    it('should log in user', (done) => {
      chai.request(server)
      .post('/api/v1/auth/login-user')
      .send(userModel.userNine)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(res).to.be.a('object');
        done();
      });
    });

});

describe('require valid token actions', (done) => {
          
    it('should check valid user token', (done) => {
      const token = '';
      chai.request(server)
      .get('/api/v1/check-balance')
      .set('authorization', token)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(403);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user apply for loan with valid amount', (done) => {
      chai.request(server)
      .post('/api/v1/loan-application')
      .set('authorization', token)
      .send({
        amount: ''
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user apply for loan with valid amount', (done) => {
      chai.request(server)
      .post('/api/v1/loan-application')
      .set('authorization', token)
      .send({
        amount: 'amount'
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user apply for loan after valid amount', (done) => {
      chai.request(server)
      .post('/api/v1/loan-application')
      .set('authorization', token)
      .send({
        amount: '100'
      })
      .end((err, res) => {
        if(err) return done(err);
        console.log(res.body);
        expect(res.status).to.equal(201);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should check valid user balance', (done) => {
      chai.request(server)
      .get('/api/v1/check-balance')
      .set('authorization', token)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user deposit with valid amount', (done) => {
      chai.request(server)
      .post('/api/v1/deposit-to-account')
      .set('authorization', token)
      .send({
        amount: ''
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user deposit with valid amount integer', (done) => {
      chai.request(server)
      .post('/api/v1/deposit-to-account')
      .set('authorization', token )
      .send({
        amount: 'amount'
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user deposit after valid amount', (done) => {
      chai.request(server)
      .post('/api/v1/deposit-to-account')
      .set('authorization', token)
      .send({
        amount: '100'
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(201);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user withdraw with valid amount', (done) => {
      chai.request(server)
      .post('/api/v1/withdraw-from-account')
      .set('authorization', token)
      .send({
        amount: ''
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user withdraw with valid amount integer', (done) => {
      chai.request(server)
      .post('/api/v1/withdraw-from-account')
      .set('authorization', token )
      .send({
        amount: 'amount'
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user withdraw after valid amount', (done) => {
      chai.request(server)
      .post('/api/v1/withdraw-from-account')
      .set('authorization', token)
      .send({
        amount: '100'
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(201);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user repay loan with valid amount', (done) => {
      chai.request(server)
      .patch('/api/v1/repay-loan/loanId=1')
      .set('authorization', token)
      .send({
        amount: ''
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user repay loan with valid amount integer', (done) => {
      chai.request(server)
      .patch('/api/v1/repay-loan/loanId=1')
      .set('authorization', token)
      .send({
        amount: 'amount'
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user repay loan after valid amount', (done) => {
      chai.request(server)
      .patch('/api/v1/repay-loan/loanId=2')
      .set('authorization', token)
      .send({
        amount: '10'
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user check transactions', (done) => {
      chai.request(server)
      .get('/api/v1/check-transaction-logs')
      .set('authorization', token)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user see loans', (done) => {
      chai.request(server)
      .get('/api/v1/see-loans')
      .set('authorization', token)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user see specific loan with valid id', (done) => {
      chai.request(server)
      .get('/api/v1/see-loans/loanId=1')
      .set('authorization', token)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(404);
        expect(res).to.be.a('object');
        done();
      });
    });
          
    it('should allow user see specific loan', (done) => {
      chai.request(server)
      .get('/api/v1/see-loan/loanId=2')
      .set('authorization', token)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(res).to.be.a('object');
        done();
      });
    });

});