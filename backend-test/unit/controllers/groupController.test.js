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
});
