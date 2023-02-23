const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Login', function () {
  before(function (done) {
    mongoose
      .connect(
        'mongodb+srv://AndiexPie6:JnoRVDRbvQXk4kPl@nodejs-learning.odff7nk.mongodb.net/test-messages?authSource=admin'
      )
      .then((result) => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          posts: [],
          _id: '5c0f66b979af55031b34728c',
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  //???
  // beforeEach(() => {
  //   // reset sth
  // });

  // afterEach(() => {
  //   // clean up sth
  // });

  it('should throw an error with code 500 if acessing the database fails', (done) => {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'test@test.com',
        password: 'tester',
      },
    };

    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done(); // signal mocha to wait this asynchronous code
    });

    User.findOne.restore();
  });

  it('should send a response with valid user status for an existing user', (done) => {
    const req = { userId: '5c0f66b979af55031b34728c' };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this; // because to chain the function json
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    // console.log(res)
    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal('I am new!');
      done();
    });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
