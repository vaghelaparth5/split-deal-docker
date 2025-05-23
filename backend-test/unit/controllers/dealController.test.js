const { expect } = require('chai');
const sinon = require('sinon');
const Deal = require('../../../src/models/Deal');
const dealController = require('../../../src/controllers/dealController');

describe('Deal Controller - Unit Tests', () => {
  let sandbox;
  let req, res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      user: { user_id: '123' },
      app: { get: sinon.stub() }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createDeal', () => {

    it('should handle server errors', async () => {
      req.body = {
        title: 'Test Deal',
        price: 100,
        original_price: 200,
        deadline: '2023-12-31',
        max_participants: 10
      };

      sandbox.stub(Deal.prototype, 'save').throws(new Error('DB error'));

      await dealController.createDeal(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ msg: 'Server Error' })).to.be.true;
    });
  });

  describe('getDeals', () => {
    it('should fetch all deals sorted by creation date', async () => {
      const mockDeals = [
        { _id: '1', title: 'Deal 1' },
        { _id: '2', title: 'Deal 2' }
      ];

      sandbox.stub(Deal, 'find').returns({
        sort: sinon.stub().resolves(mockDeals)
      });

      await dealController.getDeals(req, res);

      expect(res.json.calledWithMatch({ 
        msg: 'Deals fetched successfully',
        deals: mockDeals
      })).to.be.true;
    });

    it('should handle server errors', async () => {
      sandbox.stub(Deal, 'find').throws(new Error('DB error'));

      await dealController.getDeals(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('expireDeals', () => {
    it('should expire deals past their deadline', async () => {
      const mockResult = { modifiedCount: 3 };
      
      sandbox.stub(Deal, 'updateMany').resolves(mockResult);

      await dealController.expireDeals(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ 
        msg: 'Expired deals updated successfully',
        modifiedCount: 3
      })).to.be.true;
    });

    it('should handle server errors', async () => {
      sandbox.stub(Deal, 'updateMany').throws(new Error('DB error'));

      await dealController.expireDeals(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });
});