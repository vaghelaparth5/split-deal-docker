const { expect } = require('chai');
const mongoose = require('mongoose');
const Deal = require('../../../src/models/Deal');
const User = require('../../../src/models/User');

describe('Deal Model - Unit Tests', () => {
  let testUser;

  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user to be used as creator
    testUser = await User.create({
      user_email: 'creator@example.com',
      user_password: 'password123',
      name: 'Test Creator'
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create and save a deal successfully', async () => {
    const dealData = {
      title: 'Test Deal',
      description: 'Test Description',
      price: 100,
      original_price: 200,
      deadline: new Date(Date.now() + 86400000), // Tomorrow
      location: 'Test Location',
      max_participants: 10,
      creator: testUser._id,
      participants: [testUser._id],
      category: 'Test Category',
      image_url: 'test.jpg'
    };

    const validDeal = new Deal(dealData);
    const savedDeal = await validDeal.save();

    expect(savedDeal._id).to.exist;
    expect(savedDeal.title).to.equal(dealData.title);
    expect(savedDeal.price).to.equal(dealData.price);
    expect(savedDeal.is_active).to.be.true; // Default value
    expect(savedDeal.current_participants).to.equal(1); // Default value
  });

  it('should fail when required fields are missing', async () => {
    const dealData = {
      title: 'Test Deal',
      price: 100
    };

    const invalidDeal = new Deal(dealData);
    
    let err;
    try {
      await invalidDeal.save();
    } catch (error) {
      err = error;
    }

    expect(err).to.exist;
    expect(err.errors.original_price).to.exist;
    expect(err.errors.deadline).to.exist;
    expect(err.errors.max_participants).to.exist;
    expect(err.errors.creator).to.exist;
  });
    it('should update the deal successfully', async () => {
        const dealData = {
        title: 'Test Deal',
        description: 'Test Description',
        price: 100,
        original_price: 200,
        deadline: new Date(Date.now() + 86400000), // Tomorrow
        location: 'Test Location',
        max_participants: 10,
        creator: testUser._id,
        participants: [testUser._id],
        };
    
        const deal = new Deal(dealData);
        const savedDeal = await deal.save();
    
        savedDeal.title = 'Updated Deal';
        const updatedDeal = await savedDeal.save();
    
        expect(updatedDeal.title).to.equal('Updated Deal');
    });

    it('should delete the deal successfully', async () => {
        const dealData = {
        title: 'Test Deal',
        description: 'Test Description',
        price: 100,
        original_price: 200,
        deadline: new Date(Date.now() + 86400000), // Tomorrow
        location: 'Test Location',
        max_participants: 10,
        creator: testUser._id,
        participants: [testUser._id],
        };
    
        const deal = new Deal(dealData);
        const savedDeal = await deal.save();
    
        await Deal.findByIdAndDelete(savedDeal._id);
    
        const deletedDeal = await Deal.findById(savedDeal._id);
    
        expect(deletedDeal).to.be.null;
    });
});