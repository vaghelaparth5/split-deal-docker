const { expect } = require('chai');
const mongoose = require('mongoose');
const GroupMember = require('../../../src/models/groupMember');
const Group = require('../../../src/models/Group');
const Deal = require('../../../src/models/Deal');
const User = require('../../../src/models/User');

describe('GroupMember Model - Unit Tests', () => {
  let testGroup, testDeal, testUser;

  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    testUser = await User.create({
      user_email: 'member@example.com',
      user_password: 'password123',
      name: 'Test Member'
    });

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
      storeLocation: 'Test Location',
      totalValue: 100,
      discount: 20,
      expiryDate: new Date(Date.now() + 86400000),
      membersRequired: 5
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create and save a group member successfully', async () => {
    const memberData = {
      userId: testUser._id,
      groupId: testGroup._id,
      dealId: testDeal._id,
      contribution: 50,
      role: 'admin',
      isVerified: true
    };

    const validMember = new GroupMember(memberData);
    const savedMember = await validMember.save();

    expect(savedMember._id).to.exist;
    expect(savedMember.userId.toString()).to.equal(testUser._id.toString());
    expect(savedMember.ratingsProvided).to.equal('not submitted'); // Default value
    expect(savedMember.createdAt).to.exist; // From timestamps
  });

  it('should fail when required fields are missing', async () => {
    const memberData = {
      contribution: 50,
      role: 'team-member'
    };

    const invalidMember = new GroupMember(memberData);
    
    let err;
    try {
      await invalidMember.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.exist;
    expect(err.errors.userId).to.exist;
    expect(err.errors.groupId).to.exist;
    expect(err.errors.dealId).to.exist;
  });

  it('should validate role enum values', async () => {
    const memberData = {
      userId: testUser._id,
      groupId: testGroup._id,
      dealId: testDeal._id,
      contribution: 50,
      role: 'invalid-role'
    };

    const invalidMember = new GroupMember(memberData);
    
    let err;
    try {
      await invalidMember.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.exist;
    expect(err.errors.role).to.exist;
  });

  it('should validate ratingsProvided enum values', async () => {
    const memberData = {
      userId: testUser._id,
      groupId: testGroup._id,
      dealId: testDeal._id,
      contribution: 50,
      role: 'admin',
      ratingsProvided: 'invalid-status'
    };

    const invalidMember = new GroupMember(memberData);
    
    let err;
    try {
      await invalidMember.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.exist;
    expect(err.errors.ratingsProvided).to.exist;
  });

  it('should validate ratings are between 0 and 5', async () => {
    const memberData = {
      userId: testUser._id,
      groupId: testGroup._id,
      dealId: testDeal._id,
      contribution: 50,
      role: 'admin',
      ratings: 6
    };

    const invalidMember = new GroupMember(memberData);
    
    let err;
    try {
      await invalidMember.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.exist;
    expect(err.errors.ratings).to.exist;
  });

  it('should set default values for optional fields', async () => {
    const memberData = {
      userId: testUser._id,
      groupId: testGroup._id,
      dealId: testDeal._id,
      contribution: 50,
      role: 'team-member'
    };

    const member = new GroupMember(memberData);
    const savedMember = await member.save();

    expect(savedMember.isVerified).to.be.false;
    expect(savedMember.ratings).to.be.undefined;
    expect(savedMember.ratingsProvided).to.equal('not submitted');
    expect(savedMember.productPhoto).to.be.undefined;
  });
});