const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Group = require('../../../src/models/Group');
const groupController = require('../../../src/controllers/groupController');

describe('Group Controller - Unit Tests (Enhanced)', () => {
  let sandbox;
  let req, res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { body: {}, params: {}, app: { get: () => ({ emit: sinon.spy() }) } };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('updateGroupStatus', () => {
    it('should update status to completed', async () => {
      req.params.id = '123'; req.body.status = 'completed';
      const updatedGroup = { status: 'completed' };
      sandbox.stub(Group, 'findByIdAndUpdate').resolves(updatedGroup);
      await groupController.updateGroupStatus(req, res);
      expect(res.json.calledWithMatch({ group: updatedGroup })).to.be.true;
    });

    it('should return 404 if group not found', async () => {
      req.params.id = '123'; req.body.status = 'inactive';
      sandbox.stub(Group, 'findByIdAndUpdate').resolves(null);
      await groupController.updateGroupStatus(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should handle custom invalid status', async () => {
      req.params.id = '123'; req.body.status = 'archived';
      const updatedGroup = { status: 'archived' };
      sandbox.stub(Group, 'findByIdAndUpdate').resolves(updatedGroup);
      await groupController.updateGroupStatus(req, res);
      expect(res.json.calledWithMatch({ group: updatedGroup })).to.be.true;
    });

    it('should return 500 on DB error', async () => {
      req.params.id = '123'; req.body.status = 'completed';
      sandbox.stub(Group, 'findByIdAndUpdate').throws(new Error('DB error'));
      await groupController.updateGroupStatus(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('updateMembersRequired', () => {
    it('should update successfully', async () => {
      req.params.id = '123'; req.body.membersRequired = 5;
      const updatedGroup = { membersRequired: 5 };
      sandbox.stub(Group, 'findByIdAndUpdate').resolves(updatedGroup);
      await groupController.updateMembersRequired(req, res);
      expect(res.json.calledWithMatch({ group: updatedGroup })).to.be.true;
    });

    it('should return 400 for 0', async () => {
      req.params.id = '123'; req.body.membersRequired = 0;
      await groupController.updateMembersRequired(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 400 for missing value', async () => {
      req.params.id = '123'; req.body = {};
      await groupController.updateMembersRequired(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 400 for non-numeric value', async () => {
      req.params.id = '123'; req.body.membersRequired = "three";
      await groupController.updateMembersRequired(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should handle DB error', async () => {
      req.params.id = '123'; req.body.membersRequired = 4;
      sandbox.stub(Group, 'findByIdAndUpdate').throws(new Error('DB error'));
      await groupController.updateMembersRequired(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('updateReceiptImage', () => {
    it('should update image successfully', async () => {
      req.params.id = '123'; req.body.receiptImage = 'img.jpg';
      const updatedGroup = { receiptImage: 'img.jpg' };
      sandbox.stub(Group, 'findByIdAndUpdate').resolves(updatedGroup);
      await groupController.updateReceiptImage(req, res);
      expect(res.json.calledWithMatch({ group: updatedGroup })).to.be.true;
    });

    it('should return 400 if image is empty', async () => {
      req.params.id = '123'; req.body.receiptImage = '';
      await groupController.updateReceiptImage(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should return 404 if group not found', async () => {
      req.params.id = '123'; req.body.receiptImage = 'img.jpg';
      sandbox.stub(Group, 'findByIdAndUpdate').resolves(null);
      await groupController.updateReceiptImage(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 500 on DB error', async () => {
      req.params.id = '123'; req.body.receiptImage = 'img.jpg';
      sandbox.stub(Group, 'findByIdAndUpdate').throws(new Error('DB error'));
      await groupController.updateReceiptImage(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('deleteGroup', () => {
    it('should delete group', async () => {
      req.params.id = '123';
      sandbox.stub(Group, 'findByIdAndDelete').resolves({});
      await groupController.deleteGroup(req, res);
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return 404 if not found', async () => {
      req.params.id = '123';
      sandbox.stub(Group, 'findByIdAndDelete').resolves(null);
      await groupController.deleteGroup(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should handle DB error', async () => {
      req.params.id = '123';
      sandbox.stub(Group, 'findByIdAndDelete').throws(new Error('DB error'));
      await groupController.deleteGroup(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('getAllGroups', () => {
    it('should return all groups', async () => {
      const groups = [{ dealTitle: 'Deal 1' }];
      sandbox.stub(Group, 'find').resolves(groups);
      await groupController.getAllGroups(req, res);
      expect(res.json.calledWith(groups)).to.be.true;
    });

    it('should return empty list', async () => {
      sandbox.stub(Group, 'find').resolves([]);
      await groupController.getAllGroups(req, res);
      expect(res.json.calledWith([])).to.be.true;
    });

    it('should handle DB error', async () => {
      sandbox.stub(Group, 'find').throws(new Error('DB error'));
      await groupController.getAllGroups(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('getGroupById', () => {
    it('should return group by ID', async () => {
      req.params.id = '123';
      const group = { dealTitle: 'Test Group' };
      sandbox.stub(Group, 'findById').resolves(group);
      await groupController.getGroupById(req, res);
      expect(res.json.calledWith(group)).to.be.true;
    });

    it('should return 404 if group not found', async () => {
      req.params.id = '123';
      sandbox.stub(Group, 'findById').resolves(null);
      await groupController.getGroupById(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should handle DB error', async () => {
      req.params.id = '123';
      sandbox.stub(Group, 'findById').throws(new Error('DB error'));
      await groupController.getGroupById(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });
});
