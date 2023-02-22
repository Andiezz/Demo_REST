const expect = require('chai').expect;
const jwt = require('jsonwebtoken')

const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', function() {
  it('should throw an error if no authorization header is present', function () {
    const req = {
      get: function (headername) {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated');
  });
  
  it('should throw an error if the authorization header is only one string', function () {
    const req = {
      get: function (headername) {
        return 'xyz';
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  })

  it('should yield a userId after decoding the token', function() {
    const req = {
      get: function (headername) {
        return 'Bearer asdfgfsdgsadf';
      },
    };
    jwt.verify = function() {
      return { userId: 'abc' }
    }
    authMiddleware(req, {}, () => {})
    expect(req).to.have.property("userId");
  })
});
