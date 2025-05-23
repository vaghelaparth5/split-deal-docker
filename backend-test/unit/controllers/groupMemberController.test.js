const { expect } = require('chai');
const sinon = require('sinon');
const GroupMember = require('../../../src/models/groupMember');
const groupMemberController = require('../../../src/controllers/groupMemberController');

describe('Group Member Controller - Unit Tests', () => {
  let sandbox;
  let req, res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      params: {},
      user: { user_id: '6821e1905aac577429f3c94a' }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createAdminGroupMember', () => {
    

    it('should handle errors during admin creation', async () => {
      req.body = {
        userId: '6821e1905aac577429f3c94a',
        groupId: '456',
        dealId: '789',
        contribution: 50
      };

      sandbox.stub(GroupMember.prototype, 'save').rejects(new Error('DB error'));

      await groupMemberController.createAdminGroupMember(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('createTeamMember', () => {
    
    });

  describe('deleteTeamMember', () => {
    it('should delete a team member', async () => {
      req.params = { id: '123' };
      const mockMember = { _id: '123' };

      sandbox.stub(GroupMember, 'findByIdAndDelete').resolves(mockMember);

      await groupMemberController.deleteTeamMember(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWithMatch({
        msg: 'Team member removed successfully'
      })).to.be.true;
    });

    it('should return 404 if member not found', async () => {
      req.params = { id: '123' };
      sandbox.stub(GroupMember, 'findByIdAndDelete').resolves(null);

      await groupMemberController.deleteTeamMember(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({
        msg: 'Team member not found'
      })).to.be.true;
    });
  });

  describe('verifyTeamMember', () => {
    it('should update verification status', async () => {
      req.params = { id: '123' };
      req.body = { isVerified: true };
      const mockMember = { _id: '123', isVerified: true };

      sandbox.stub(GroupMember, 'findByIdAndUpdate').resolves(mockMember);

      await groupMemberController.verifyTeamMember(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWithMatch({
        msg: 'Team member verification status updated',
        groupMember: mockMember
      })).to.be.true;
    });
  });

  describe('updateRatingsProvided', () => {
    it('should update ratings status to "submitted"', async () => {
      req.params = { id: '123' };
      req.body = { ratingsProvided: 'submitted' };
      const mockMember = { _id: '123', ratingsProvided: 'submitted' };

      sandbox.stub(GroupMember, 'findByIdAndUpdate').resolves(mockMember);

      await groupMemberController.updateRatingsProvided(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWithMatch({
        msg: 'Ratings status updated successfully',
        groupMember: mockMember
      })).to.be.true;
    });

    it('should return 400 for invalid status', async () => {
      req.params = { id: '123' };
      req.body = { ratingsProvided: 'invalid' };

      await groupMemberController.updateRatingsProvided(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({
        msg: 'Invalid ratingsProvided status'
      })).to.be.true;
    });
  });

  describe('getGroupMembersByGroupId', () => {
    it('should fetch members for a group', async () => {
      req.params = { groupId: '123' };
      const mockMembers = [
        { _id: '1', groupId: '123' },
        { _id: '2', groupId: '123' }
      ];

      sandbox.stub(GroupMember, 'find').returns({
        populate: sinon.stub().returns({
          populate: sinon.stub().resolves(mockMembers)
        })
      });

      await groupMemberController.getGroupMembersByGroupId(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWithMatch({
        msg: 'Group members fetched successfully',
        groupMembers: mockMembers
      })).to.be.true;
    });

    it('should return 404 if no members found', async () => {
      req.params = { groupId: '123' };
      sandbox.stub(GroupMember, 'find').returns({
        populate: sinon.stub().returns({
          populate: sinon.stub().resolves([])
        })
      });

      await groupMemberController.getGroupMembersByGroupId(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({
        msg: 'No group members found for this group'
      })).to.be.true;
    });
  });

   describe('getGroupIdsByUserId', () => {
   
     });
});