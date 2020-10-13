const chai = require('chai');

const chaiHttp = require('chai-http');

const userModel = require('../models/user.models');

const server = require('../server');

const { pool } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;

beforeEach('test', (done) => {
    pool.query(`create table if not exists users_dummy (
        id serial primary key,
        name varchar(100),
        email varchar(100),
        phone varchar(50),
        password varchar(255),
        isverified boolean,
        balance integer
   );`);
   done();
});

afterEach('test', (done) => {
    pool.query(`drop table if exists users_dummy`);
    done();
});

describe('create user', () => {
    it('should check all fields are available', (done) => {
      chai.request(server)
      .post('/api/v1/auth/create-user')
      .send(userModel.userOne)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
    xit('should check email and phone are valid', (done) => {
      chai.request(server)
      .post('/api/v1/auth/create-user')
      .send(userModel.userTwo)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
    xit('should check if user already exists', (done) => {
      chai.request(server)
      .post('/api/v1/auth/create-user')
      .send(userModel.userThree)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
    xit('should sign up user', (done) => {
        chai.request(server)
        .post('/api/v1/auth/create-user')
        .send(userModel.userFour)
        .end((err, res) => {
            if(err) return done(err);
            console.log(res.text);
            expect(res.status).to.equal(201);
            expect(res).to.be.a('object');
            done();
      });
    });
});

describe('login user', () => {
    it('should check all fields are available', (done) => {
      chai.request(server)
      .post('/api/v1/auth/login-user')
      .send(userModel.userSix)
      .end((err, res) => {
        if(err) return done(err);
        console.log(res.text);
        expect(res.status).to.equal(409);
        expect(res).to.be.a('object');
        done();
      });
    });
});