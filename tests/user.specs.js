const chai = require('chai');

const userModel = require('../models/user.models');

const expect = chai.expect;

console.log(userModel);
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
});
  