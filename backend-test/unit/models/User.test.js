const { expect } = require('chai');
const mongoose = require('mongoose');
const User = require('../../../src/models/User');

describe('User Model - Unit Tests', () => {
  before(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/test-user-model', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create and save a user successfully with defaults', async () => {
    const user = new User({
      user_email: 'test@example.com',
      user_password: 'securepassword123'
    });

    const savedUser = await user.save();

    expect(savedUser._id).to.exist;
    expect(savedUser.name).to.equal('');
    expect(savedUser.rating_score).to.equal(0);
    expect(savedUser.resetPasswordToken).to.equal('');
    expect(savedUser.resetPasswordExpires).to.be.null; // ✅ Updated
  });

  it('should fail without required fields (email/password)', async () => {
    const user = new User({});

    try {
      await user.save();
    } catch (err) {
      expect(err).to.exist;
      expect(err.errors.user_email).to.exist;
      expect(err.errors.user_password).to.exist;
    }
  });

  it('should enforce unique email constraint', async () => {
    const user1 = new User({
      user_email: 'duplicate@example.com',
      user_password: 'pass1'
    });

    const user2 = new User({
      user_email: 'duplicate@example.com',
      user_password: 'pass2'
    });

    await user1.save();

    try {
      await user2.save();
    } catch (err) {
      expect(err).to.exist;
      expect(err.code).to.equal(11000); // Mongo duplicate key error
    }
  });

  it('should update user fields successfully', async () => {
    const user = new User({
      user_email: 'update@example.com',
      user_password: 'pass'
    });

    const saved = await user.save();
    saved.name = 'Gaurav';
    saved.phone_number = '9876543210';
    saved.total_money_saved = 100;

    const updated = await saved.save();

    expect(updated.name).to.equal('Gaurav');
    expect(updated.phone_number).to.equal('9876543210');
    expect(updated.total_money_saved).to.equal(100);
  });

  it('should allow setting reset token and expiry date', async () => {
    const user = new User({
      user_email: 'reset@example.com',
      user_password: 'pass',
      resetPasswordToken: 'token123',
      resetPasswordExpires: new Date('2030-01-01')
    });

    const saved = await user.save();

    expect(saved.resetPasswordToken).to.equal('token123');
    expect(saved.resetPasswordExpires.toISOString()).to.equal(new Date('2030-01-01').toISOString());
  });

  it('should default numeric fields to 0', async () => {
    const user = new User({
      user_email: 'numeric@example.com',
      user_password: 'pass'
    });

    const saved = await user.save();

    expect(saved.successful_orders).to.equal(0);
    expect(saved.failure_order).to.equal(0);
    expect(saved.number_of_people_rated).to.equal(0);
  });
});
