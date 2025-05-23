const { expect } = require('chai');
const request = require('supertest');
const app = require('../../../src/index');
const User = require('../../../src/models/User');
const { connect, close, clear } = require('../../helpers/db');

describe('Auth API - E2E Tests', () => {
  before(async () => {
    await connect();
  });

  afterEach(async () => {
    await clear();
  });

  after(async () => {
    await close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          user_email: 'test@example.com',
          user_password: 'password123',
          name: 'Test User',
          phone_number: '1234567890'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('msg', 'User registered successfully');
      expect(res.body.user).to.have.property('user_email', 'test@example.com');
    });

    it('should fail with duplicate email', async () => {
      await User.create({
        user_email: 'test@example.com',
        user_password: 'password123',
        name: 'Test User'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          user_email: 'test@example.com',
          user_password: 'password123',
          name: 'Test User',
          phone_number: '1234567890'
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('msg', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      await User.create({
        user_email: 'test@example.com',
        user_password: hashedPassword,
        name: 'Test User'
      });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          user_email: 'test@example.com',
          user_password: 'password123'
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('msg', 'Authentication successful');
      expect(res.body).to.have.property('token');
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          user_email: 'test@example.com',
          user_password: 'wrongpassword'
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('msg', 'Invalid Credentials');
    });
  });

  // Add more test cases for other endpoints
});