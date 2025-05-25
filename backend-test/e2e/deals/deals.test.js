const { expect } = require('chai');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../../../src/app');
const Deal = require('../../../src/models/Deal');
const User = require('../../../src/models/User');
const { connect, clear, close } = require('../../helpers/db');

const SECRET = process.env.JWT_SECRET;
let token;
let testUser;

describe('Deals API - E2E Tests', function() {
  this.timeout(5000); // Increase timeout for all tests

  before(async () => {
    await connect();

    // Create test user and generate token
    testUser = await User.create({
      user_email: 'test@example.com',
      user_password: 'hashedpassword',
      name: 'Test User'
    });

    token = jwt.sign({ user_id: testUser._id }, SECRET, { expiresIn: '1h' });
  });

  afterEach(async () => {
    await clear();
  });

  after(async () => {
    await close();
  });

  describe('POST /api/deal/create', () => {
    it('should create a new deal with valid data', async () => {
      const res = await request(app)
        .post('/api/deal/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Deal',
          description: 'Test Description',
          price: 100,
          original_price: 200,
          deadline: new Date(Date.now() + 86400000).toISOString(),
          location: 'Test Location',
          max_participants: 10,
          category: 'Test',
          image_url: 'test.jpg'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('msg', 'Deal created successfully');
      expect(res.body.deal).to.have.property('title', 'Test Deal');
      expect(res.body.deal).to.have.property('creator', testUser._id.toString());
      expect(res.body.deal).to.have.property('is_active', true);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/deal/create')
        .send({
          title: 'Test Deal',
          price: 100,
          original_price: 200,
          deadline: new Date(Date.now() + 86400000).toISOString(),
          max_participants: 10
        });

      expect(res.status).to.equal(401);
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/deal/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Deal',
          price: 100
        });

      expect(res.status).to.equal(500);
    });
  });

  describe('GET /api/deal/get', () => {
    it('should fetch all active deals sorted by creation date', async () => {
      // Create test deals
      await Deal.create([
        {
          title: 'Deal 1',
          price: 100,
          original_price: 200,
          deadline: new Date(Date.now() + 86400000),
          max_participants: 10,
          creator: testUser._id,
          participants: [testUser._id],
          createdAt: new Date(Date.now() - 1000) // Older deal
        },
        {
          title: 'Deal 2',
          price: 150,
          original_price: 300,
          deadline: new Date(Date.now() + 86400000),
          max_participants: 5,
          creator: testUser._id,
          participants: [testUser._id],
          createdAt: new Date() // Newer deal
        }
      ]);

      const res = await request(app)
        .get('/api/deal/get');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('msg', 'Deals fetched successfully');
      expect(res.body.deals).to.be.an('array').with.lengthOf(2);
      // Should be sorted newest first
      expect(res.body.deals[0].title).to.equal('Deal 1');
      expect(res.body.deals[1].title).to.equal('Deal 2');
    });

    it('should not return inactive deals', async () => {
        await Deal.create([
          {
            title: 'Active Deal',
            price: 100,
            original_price: 200,
            deadline: new Date(Date.now() + 86400000),
            max_participants: 10,
            creator: testUser._id,
            participants: [testUser._id],
            is_active: true
          },
          {
            title: 'Inactive Deal',
            price: 100,
            original_price: 200,
            deadline: new Date(Date.now() + 86400000),
            max_participants: 10,
            creator: testUser._id,
            participants: [testUser._id],
            is_active: false
          }
        ]);
      
        const res = await request(app)
          .get('/api/deal/get');
      
        expect(res.status).to.equal(200);
        
        // Check that only active deals are returned
        const activeDeals = res.body.deals.filter(deal => deal.is_active);
        expect(activeDeals).to.be.an('array').with.lengthOf(1);
        expect(activeDeals[0].title).to.equal('Active Deal');
      });

    it('should return empty array when no deals exist', async () => {
      const res = await request(app)
        .get('/api/deal/get');

      expect(res.status).to.equal(200);
      expect(res.body.deals).to.be.an('array').that.is.empty;
    });
  });

  describe('PATCH /api/deal/expire', () => {
    it('should expire outdated deals', async () => {
      // Create active and expired deals
      await Deal.create([
        {
          title: 'Active Deal',
          price: 100,
          original_price: 200,
          deadline: new Date(Date.now() + 86400000), // Future
          max_participants: 10,
          creator: testUser._id,
          participants: [testUser._id],
          is_active: true
        },
        {
          title: 'Expired Deal',
          price: 100,
          original_price: 200,
          deadline: new Date(Date.now() - 86400000), // Past
          max_participants: 10,
          creator: testUser._id,
          participants: [testUser._id],
          is_active: true
        }
      ]);

      const res = await request(app)
        .patch('/api/deal/expire')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('msg', 'Expired deals updated successfully');
      expect(res.body.modifiedCount).to.equal(1);

      // Verify only the expired deal was updated
      const activeDeal = await Deal.findOne({ title: 'Active Deal' });
      const expiredDeal = await Deal.findOne({ title: 'Expired Deal' });
      expect(activeDeal.is_active).to.be.true;
      expect(expiredDeal.is_active).to.be.false;
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .patch('/api/deal/expire');

      expect(res.status).to.equal(401);
    });
  });
});