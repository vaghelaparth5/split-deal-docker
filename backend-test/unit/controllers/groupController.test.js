const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Group = require('../../../src/models/Group');
const groupController = require('../../../src/controllers/groupController');

describe('Group Controller - Unit Tests', () => {
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
        it('should update status successfully', async () => {
            req.params.id = '123';
            req.body.status = 'completed';
            const updatedGroup = { status: 'completed' };

            sandbox.stub(Group, 'findByIdAndUpdate').resolves(updatedGroup);

            await groupController.updateGroupStatus(req, res);

            expect(res.json.calledWithMatch({ group: updatedGroup })).to.be.true;
        });

        it('should return 404 if group not found', async () => {
            req.params.id = '123';
            req.body.status = 'inactive';

            sandbox.stub(Group, 'findByIdAndUpdate').resolves(null);

            await groupController.updateGroupStatus(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('should still update even with an invalid value if schema allows', async () => {
            req.params.id = '123';
            req.body.status = 'finished';

            const updatedGroup = { status: 'finished' };
            sandbox.stub(Group, 'findByIdAndUpdate').resolves(updatedGroup);

            await groupController.updateGroupStatus(req, res);

            expect(res.json.calledWithMatch({ group: updatedGroup })).to.be.true;
        });
    });

    describe('updateMembersRequired', () => {
        it('should update membersRequired', async () => {
            req.params.id = '123';
            req.body.membersRequired = 4;
            const updatedGroup = { membersRequired: 4 };

            sandbox.stub(Group, 'findByIdAndUpdate').resolves(updatedGroup);

            await groupController.updateMembersRequired(req, res);

            expect(res.json.calledWithMatch({ group: updatedGroup })).to.be.true;
        });

        it('should return 400 for invalid number', async () => {
            req.params.id = '123';
            req.body.membersRequired = 0;

            await groupController.updateMembersRequired(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });

        it('should return 400 for missing value', async () => {
            req.params.id = '123';
            req.body = {};

            await groupController.updateMembersRequired(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });
    });
    describe('updateReceiptImage', () => {
        it('should update receipt image', async () => {
            req.params.id = '123';
            req.body.receiptImage = 'image.jpg';
            const updatedGroup = { receiptImage: 'image.jpg' };

            sandbox.stub(Group, 'findByIdAndUpdate').resolves(updatedGroup);

            await groupController.updateReceiptImage(req, res);

            expect(res.json.calledWithMatch({ group: updatedGroup })).to.be.true;
        });

        it('should return 400 if image missing', async () => {
            req.params.id = '123';
            req.body.receiptImage = '';

            await groupController.updateReceiptImage(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });

        it('should accept any string even if not a valid image (unless validated)', async () => {
            req.params.id = '123';
            req.body.receiptImage = 'not-an-image-url';

            const updatedGroup = { receiptImage: 'not-an-image-url' };
            sandbox.stub(Group, 'findByIdAndUpdate').resolves(updatedGroup);

            await groupController.updateReceiptImage(req, res);

            expect(res.json.calledWithMatch({ group: updatedGroup })).to.be.true;
        });
    });

    describe('deleteGroup', () => {
        it('should delete a group', async () => {
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
    });
    describe('getAllGroups', () => {
        it('should return all groups', async () => {
            const mockGroups = [{ dealTitle: 'Test' }];
            sandbox.stub(Group, 'find').resolves(mockGroups);

            await groupController.getAllGroups(req, res);

            expect(res.json.calledWith(mockGroups)).to.be.true;
        });

        it('should return empty array if no groups exist', async () => {
            sandbox.stub(Group, 'find').resolves([]);

            await groupController.getAllGroups(req, res);

            expect(res.json.calledWith([])).to.be.true;
        });
    });

});
