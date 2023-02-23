const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const io = require('../socket');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller - Login', function () {
  before(function(done) {
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

  it('should add a created post to the posts of the creator', function(done) {
    const req = {
      file: {
        path: 'abc',
      },
      body: {
        title: 'Test Post',
        content: 'A Test Post',
      },
      userId: '5c0f66b979af55031b34728c',
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    const stub = sinon.stub(io, 'getIO').callsFake(() => {
      return {
        emit: function() {}
      }
    });

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
      stub.restore();
      done();
    });
  });

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
