const { expect } = require('chai');
const mongoose = require('mongoose');
const Group = require('../../../src/models/Group');
const Deal = require('../../../src/models/Deal');
const User = require('../../../src/models/User');

describe('Group Model - Unit Tests', () => {
  let testDeal, testUser;

  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    testUser = await User.create({
      user_email: 'creator@example.com',
      user_password: 'password123',
      name: 'Test Creator'
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
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create and save a group successfully', async () => {
    const groupData = {
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
    };

    const validGroup = new Group(groupData);
    const savedGroup = await validGroup.save();

    expect(savedGroup._id).to.exist;
    expect(savedGroup.dealId.toString()).to.equal(testDeal._id.toString());
    expect(savedGroup.status).to.equal('active'); // Default value
    expect(savedGroup.creationDate).to.exist; // Auto-generated timestamp
  });

  it('should fail when required fields are missing', async () => {
    const groupData = {
      dealTitle: 'Test Deal',
      discount: 20
    };

    const invalidGroup = new Group(groupData);
    
    let err;
    try {
      await invalidGroup.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.exist;
    expect(err.errors.dealId).to.exist;
    expect(err.errors.dealLogo).to.exist;
    expect(err.errors.storeLocation).to.exist;
    expect(err.errors.totalValue).to.exist;
    expect(err.errors.expiryDate).to.exist;
    expect(err.errors.membersRequired).to.exist;
  });

  it('should validate status enum values', async () => {
    const groupData = {
      dealId: testDeal._id,
      dealLogo: 'logo.jpg',
      dealTitle: 'Test Deal',
      storeLocation: 'Test Location',
      totalValue: 100,
      discount: 20,
      expiryDate: new Date(Date.now() + 86400000),
      membersRequired: 5,
      status: 'invalid-status'
    };

    const invalidGroup = new Group(groupData);
    
    let err;
    try {
      await invalidGroup.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.exist;
    expect(err.errors.status).to.exist;
  });

  it('should automatically set creationDate', async () => {
    const groupData = {
      dealId: testDeal._id,
      dealLogo: 'logo.jpg',
      dealTitle: 'Test Deal',
      storeLocation: 'Test Location',
      totalValue: 100,
      discount: 20,
      expiryDate: new Date(Date.now() + 86400000),
      membersRequired: 5
    };

    const group = new Group(groupData);
    const savedGroup = await group.save();

    expect(savedGroup.creationDate).to.exist;
    expect(savedGroup.createdAt).to.exist; // From timestamps
    expect(savedGroup.updatedAt).to.exist; // From timestamps
  });

    it('should update group status successfully', async () => {
        const groupData = {
        dealId: testDeal._id,
        dealLogo: 'logo.jpg',
        dealTitle: 'Test Deal',
        storeLocation: 'Test Location',
        totalValue: 100,
        discount: 20,
        expiryDate: new Date(Date.now() + 86400000),
        membersRequired: 5
        };
    
        const group = new Group(groupData);
        const savedGroup = await group.save();
    
        savedGroup.status = 'completed';
        const updatedGroup = await savedGroup.save();
    
        expect(updatedGroup.status).to.equal('completed');
    });
    it('should delete the group successfully', async () => {
        const groupData = {
        dealId: testDeal._id,
        dealLogo: 'logo.jpg',
        dealTitle: 'Test Deal',
        storeLocation: 'Test Location',
        totalValue: 100,
        discount: 20,
        expiryDate: new Date(Date.now() + 86400000),
        membersRequired: 5
        };
    
        const group = new Group(groupData);
        const savedGroup = await group.save();
    
        await Group.findByIdAndDelete(savedGroup._id);
    
        const deletedGroup = await Group.findById(savedGroup._id);
    
        expect(deletedGroup).to.be.null;
    }
    );
});