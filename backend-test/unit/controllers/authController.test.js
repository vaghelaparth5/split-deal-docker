const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const authController = require('../../../src/controllers/authController');
const User = require('../../../src/models/User');

describe('Auth Controller - Unit Tests', () => {
  let sandbox;
  let req, res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        user_email: 'test@example.com',
        user_password: 'password123',
        name: 'Test User',
        phone_number: '1234567890'
      };

      sandbox.stub(User, 'findOne').resolves(null);
      sandbox.stub(bcrypt, 'genSalt').resolves('salt');
      sandbox.stub(bcrypt, 'hash').resolves('hashedPassword');
      sandbox.stub(User.prototype, 'save').resolves({
        _id: '123',
        user_email: 'test@example.com',
        name: 'Test User'
      });

      await authController.registerUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return error if user already exists', async () => {
      req.body = {
        user_email: 'test@example.com',
        user_password: 'password123',
        name: 'Test User',
        phone_number: '1234567890'
      };

      sandbox.stub(User, 'findOne').resolves({});

      await authController.registerUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ msg: 'User already exists' })).to.be.true;
    });

    it('should handle server errors', async () => {
      req.body = {
        user_email: 'test@example.com',
        user_password: 'password123',
        name: 'Test User',
        phone_number: '1234567890'
      };

      sandbox.stub(User, 'findOne').throws(new Error('DB error'));

      await authController.registerUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      req.body = {
        user_email: 'test@example.com',
        user_password: 'password123'
      };

      const mockUser = {
        _id: '123',
        user_email: 'test@example.com',
        user_password: 'hashedPassword',
        name: 'Test User'
      };

      sandbox.stub(User, 'findOne').resolves(mockUser);
      sandbox.stub(bcrypt, 'compare').resolves(true);
      sandbox.stub(jwt, 'sign').returns('token');

      await authController.loginUser(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.args[0][0].msg).to.equal('Authentication successful');
    });

    it('should return error for invalid credentials (user not found)', async () => {
      req.body = {
        user_email: 'test@example.com',
        user_password: 'password123'
      };

      sandbox.stub(User, 'findOne').resolves(null);

      await authController.loginUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ msg: 'Invalid Credentials' })).to.be.true;
    });

    it('should return error for invalid credentials (wrong password)', async () => {
      req.body = {
        user_email: 'test@example.com',
        user_password: 'password123'
      };

      const mockUser = {
        _id: '123',
        user_email: 'test@example.com',
        user_password: 'hashedPassword',
        name: 'Test User'
      };

      sandbox.stub(User, 'findOne').resolves(mockUser);
      sandbox.stub(bcrypt, 'compare').resolves(false);

      await authController.loginUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ msg: 'Invalid Credentials' })).to.be.true;
    });
  });

  // need unit test for forgot password 

  // need unit test for reset password

});