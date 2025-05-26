// backend-test/unit/controllers/fetchDealsJob.test.js
const { expect } = require("chai");
const sinon = require("sinon");
const axios = require("axios");
const Deal = require("../../../src/models/Deal");
const fetchDealsJob = require("../../../src/cronJobs/fetchDealsJob");

describe("fetchDealsJob - Cron Job", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(axios, "get"); // Stub external API call
    sandbox.stub(Deal, "findOne"); // Stub DB lookup
    sandbox.stub(Deal, "insertMany"); // Stub DB insert
    sandbox.stub(console, "error"); // Stub console error logging
    sandbox.stub(console, "log"); // Stub console log output
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should insert new deals into DB if they don't exist", async () => {
    const dummyProducts = {
      data: {
        products: [
          {
            title: "iPhone",
            description: "Apple",
            price: 999,
            discountPercentage: 10,
            brand: "Apple",
            thumbnail: "img.jpg",
          },
        ],
      },
    };

    axios.get.resolves(dummyProducts);
    Deal.findOne.resolves(null); // Deal does not exist in DB

    await fetchDealsJob();

    expect(Deal.insertMany.calledOnce).to.be.true;
    expect(console.log.calledWithMatch("[CRON] Inserted 1 new deal(s)."));
  });

  it("should skip inserting if deal already exists", async () => {
    axios.get.resolves({ data: { products: [{ title: "iPhone" }] } });
    Deal.findOne.resolves({ title: "iPhone" }); // Deal exists already

    await fetchDealsJob();

    expect(Deal.insertMany.called).to.be.false;
    expect(console.log.calledWithMatch("[CRON] No new deals to insert"));
  });

  it("should log an error if API call fails", async () => {
    const error = new Error("API Down");
    axios.get.rejects(error);

    await fetchDealsJob();

    expect(console.error.calledWithMatch("[CRON] Error in fetchDealsJob: API Down")).to.be.true;
  });

  it("should handle empty products array from API", async () => {
    axios.get.resolves({ data: { products: [] } });

    await fetchDealsJob();

    expect(Deal.insertMany.called).to.be.false;
    expect(console.log.calledWithMatch("[CRON] No new deals to insert"));
  });

  it("should not crash if product lacks optional fields", async () => {
    axios.get.resolves({ data: { products: [{ title: "NewItem" }] } });
    Deal.findOne.resolves(null);

    await fetchDealsJob();

    expect(Deal.insertMany.calledOnce).to.be.true;
  });
});