const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../src/middleware/authMiddleware');

describe('Auth Middleware - Unit Tests', () => {
  let sandbox;
  let req, res, next;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      header: sinon.stub()
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return 401 if no token provided', () => {
    req.header.returns(undefined);

    authMiddleware(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ msg: 'No token, authorization denied' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should call next() with valid token', () => {
    const mockUser = { user_id: '123' };
    req.header.returns('Bearer valid.token.here');
    
    sandbox.stub(jwt, 'verify').returns(mockUser);

    authMiddleware(req, res, next);

    expect(req.user).to.deep.equal(mockUser);
    expect(next.calledOnce).to.be.true;
  });

  it('should return 401 with invalid token', () => {
    req.header.returns('Bearer invalid.token.here');
    
    sandbox.stub(jwt, 'verify').throws(new Error('Invalid token'));

    authMiddleware(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ msg: 'Invalid token' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });
});