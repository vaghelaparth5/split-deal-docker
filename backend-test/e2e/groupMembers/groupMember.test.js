const { expect } = require('chai');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../../../src/app');
const GroupMember = require('../../../src/models/groupMember');
const Group = require('../../../src/models/Group');
const Deal = require('../../../src/models/Deal');
const User = require('../../../src/models/User');
const { connect, clear, close } = require('../../helpers/db');

const SECRET = process.env.JWT_SECRET;
let token;
let testUser;
let testDeal;
let testGroup;

describe('Group Members API - E2E Tests', function() {
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

    // Create test deal and group
    testDeal = await Deal.create({
      title: 'Test Deal',
      price: 100,
      original_price: 200,
      deadline: new Date(Date.now() + 86400000),
      max_participants: 10,
      creator: testUser._id,
      participants: [testUser._id]
    });

    testGroup = await Group.create({
      dealId: testDeal._id,
      dealLogo: 'logo.jpg',
      dealTitle: 'Test Deal',
      dealDescription: 'Test Description',
      storeName: 'Test Store',
      storeLocation: 'Test Location',
      totalValue: 100,
      discount: 20,
      expiryDate: new Date(Date.now() + 86400000),
      membersRequired: 5,
      receiptImage: 'receipt.jpg'
    });
  });

  afterEach(async () => {
    await clear();
  });

  after(async () => {
    await close();
  });

  describe('POST /api/groupMember/create-admin-group-member', () => {
    it('should create an admin group member', async () => {
      const res = await request(app)
        .post('/api/groupMember/create-admin-group-member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: testUser._id.toString(),
          groupId: testGroup._id.toString(),
          dealId: testDeal._id.toString(),
          contribution: 50,
          productPhoto: 'product.jpg'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('msg', 'Admin group member created successfully');
      expect(res.body.groupMember).to.have.property('role', 'admin');
      expect(res.body.groupMember).to.have.property('isVerified', true);
    });

    it('should fail with invalid group ID', async () => {
      const res = await request(app)
        .post('/api/groupMember/create-admin-group-member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: testUser._id.toString(),
          groupId: 'invalid-id',
          dealId: testDeal._id.toString(),
          contribution: 50
        });

      expect(res.status).to.equal(500);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/groupMember/create-admin-group-member')
        .send({
          userId: testUser._id.toString(),
          groupId: testGroup._id.toString(),
          dealId: testDeal._id.toString(),
          contribution: 50
        });

      expect(res.status).to.equal(401);
    });
  });

  describe('POST /api/groupMember/create-team-member', () => {
    it('should create a team member with pending verification', async () => {
      const res = await request(app)
        .post('/api/groupMember/create-team-member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: testUser._id.toString(),
          groupId: testGroup._id.toString(),
          dealId: testDeal._id.toString(),
          contribution: 30,
          productPhoto: 'product.jpg'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('msg', 'Team member request submitted');
      expect(res.body.groupMember).to.have.property('role', 'team-member');
      expect(res.body.groupMember).to.have.property('isVerified', false);
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/groupMember/create-team-member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: testUser._id.toString(),
          groupId: testGroup._id.toString()
        });

      expect(res.status).to.equal(500);
    });
  });

  describe('DELETE /api/groupMember/delete-team-member/:id', () => {
    let testMember;

    beforeEach(async () => {
      testMember = await GroupMember.create({
        userId: testUser._id,
        groupId: testGroup._id,
        dealId: testDeal._id,
        contribution: 50,
        role: 'team-member',
        isVerified: false
      });
    });

    it('should delete a team member', async () => {
      const res = await request(app)
        .delete(`/api/groupMember/delete-team-member/${testMember._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('msg', 'Team member removed successfully');

      // Verify member was actually deleted
      const deletedMember = await GroupMember.findById(testMember._id);
      expect(deletedMember).to.be.null;
    });

    it('should return 404 for non-existent member', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/groupMember/delete-team-member/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
    });
  });

  describe('PUT /api/groupMember/verify-team-member/:id', () => {
    let testMember;

    beforeEach(async () => {
      testMember = await GroupMember.create({
        userId: testUser._id,
        groupId: testGroup._id,
        dealId: testDeal._id,
        contribution: 50,
        role: 'team-member',
        isVerified: false
      });
    });

    it('should verify a team member', async () => {
      const res = await request(app)
        .put(`/api/groupMember/verify-team-member/${testMember._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          isVerified: true
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('msg', 'Team member verification status updated');
      expect(res.body.groupMember).to.have.property('isVerified', true);
    });

    it('should unverify a team member', async () => {
      testMember.isVerified = true;
      await testMember.save();

      const res = await request(app)
        .put(`/api/groupMember/verify-team-member/${testMember._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          isVerified: false
        });

      expect(res.status).to.equal(200);
      expect(res.body.groupMember).to.have.property('isVerified', false);
    });
  });

  describe('GET /api/groupMember/get-group-members/:groupId', () => {
    beforeEach(async () => {
      // Create test members
      await GroupMember.create([
        {
          userId: testUser._id,
          groupId: testGroup._id,
          dealId: testDeal._id,
          contribution: 50,
          role: 'admin',
          isVerified: true
        },
        {
          userId: testUser._id,
          groupId: testGroup._id,
          dealId: testDeal._id,
          contribution: 30,
          role: 'team-member',
          isVerified: false
        }
      ]);
    });

    it('should fetch all members for a group', async () => {
      const res = await request(app)
        .get(`/api/groupMember/get-group-members/${testGroup._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('msg', 'Group members fetched successfully');
      expect(res.body.groupMembers).to.be.an('array').with.lengthOf(2);
      expect(res.body.groupMembers[0]).to.have.property('groupId', testGroup._id.toString());
    });

    it('should return 404 for non-existent group', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/groupMember/get-group-members/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
    });
  });

  describe('GET /api/groupMember/get-group-ids/:userId', () => {
    it('should fetch group IDs for a user', async () => {
      // Create test membership
      await GroupMember.create({
        userId: testUser._id,
        groupId: testGroup._id,
        dealId: testDeal._id,
        contribution: 50,
        role: 'admin',
        isVerified: true
      });

      const res = await request(app)
        .get(`/api/groupMember/get-group-ids/${testUser._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('msg', 'Group IDs fetched successfully');
      expect(res.body.groupIds).to.be.an('array').with.lengthOf(1);
      expect(res.body.groupIds[0]).to.equal(testGroup._id.toString());
    });

    
  });

  describe('PUT /api/groupMember/update-ratings-provided/:id', () => {
    let testMember;

    beforeEach(async () => {
      testMember = await GroupMember.create({
        userId: testUser._id,
        groupId: testGroup._id,
        dealId: testDeal._id,
        contribution: 50,
        role: 'team-member',
        isVerified: true,
        ratingsProvided: 'not submitted'
      });
    });

    it('should update ratings status to "submitted"', async () => {
      const res = await request(app)
        .put(`/api/groupMember/update-ratings-provided/${testMember._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ratingsProvided: 'submitted'
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('msg', 'Ratings status updated successfully');
      expect(res.body.groupMember).to.have.property('ratingsProvided', 'submitted');
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app)
        .put(`/api/groupMember/update-ratings-provided/${testMember._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          ratingsProvided: 'invalid-status'
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('msg', 'Invalid ratingsProvided status');
    });
  });
});