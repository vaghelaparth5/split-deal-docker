// backend-test/unit/controllers/dealExpiryJob.test.js
const { expect } = require("chai");
const sinon = require("sinon");
const dealExpiryJob = require("../../../src/cronJobs/dealExpiryJob");
const Deal = require("../../../src/models/Deal");

describe("dealExpiryJob - Cron Job", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, "log"); // Stub to suppress and check logs
    sandbox.stub(console, "error"); // Stub to suppress and check errors
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should mark expired deals inactive", async () => {
    // Mock DB response to indicate 2 deals were modified
    const updateStub = sandbox.stub(Deal, "updateMany").resolves({ modifiedCount: 2 });

    await dealExpiryJob();

    expect(updateStub.calledOnce).to.be.true;
    expect(updateStub.args[0][1]).to.eql({ is_active: false });
    expect(console.log.calledWithMatch("[CRON] Marked 2 deal(s) as expired")).to.be.true;
  });

  it("should log an error if DB fails", async () => {
    const error = new Error("DB Failure");
    sandbox.stub(Deal, "updateMany").rejects(error);

    await dealExpiryJob();

    expect(console.error.calledWithMatch("[CRON] Error in dealExpiryJob: DB Failure")).to.be.true;
  });

  it("should print zero if no deals were expired", async () => {
    sandbox.stub(Deal, "updateMany").resolves({ modifiedCount: 0 });

    await dealExpiryJob();

    expect(console.log.calledWithMatch("[CRON] Marked 0 deal(s) as expired")).to.be.true;
  });
});
