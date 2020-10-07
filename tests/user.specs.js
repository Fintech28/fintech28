const chai = require('chai');

const chaiHttp = require('chai-http');

// const userModel = require('../models/user.models');

// const server = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;

// describe('create user', () => {
//     it('should check all fields are available', (done) => {
//       chai.request(server)
//       .post('/api/v1/auth/create-user')
//       .send(userModel.userOne)
//       .end((err, res) => {
//         if(err) return done(err);
//         expect(res.status).to.equal(409);
//         expect(res).to.be.a('object');
//         done();
//       });
//     });
// });


describe('should check that 2 plus 2 is 4', () => {
    it('should check that 2 and 2 is 4', () => {
        expect(2+2).toEqual(4);
    });
});