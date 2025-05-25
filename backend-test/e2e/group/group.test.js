const request = require("supertest");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const app = require("../../../src/app");
const Group = require("../../../src/models/Group");
const User = require("../../../src/models/User");
const { connect, clear, close } = require("../../helpers/db");

const SECRET = process.env.JWT_SECRET;
let token;

describe("Group API - E2E Tests", () => {
    before(async () => {
        await connect();

        // Create a test user and generate token
        const user = new User({
            user_email: "test@example.com",
            user_password: "hashedpass",
            name: "Test User"
        });
        await user.save();

        token = jwt.sign({ user_id: user._id }, SECRET, { expiresIn: "1h" });
    });

    afterEach(async () => {
        await clear();
    });

    after(async () => {
        await close();
    });

    describe("POST /api/group/create-group", () => {
        it("should create a new group", async () => {
            const res = await request(app)
                .post("/api/group/create-group")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    dealId: "60d21b4667d0d8992e610c85",
                    dealLogo: "https://example.com/logo.png",
                    dealTitle: "Test Deal",
                    dealDescription: "This is a test deal",
                    storeName: "Test Store",
                    storeLocation: "Test City",
                    totalValue: 100,
                    discount: 20,
                    expiryDate: new Date(Date.now() + 86400000).toISOString(),
                    membersRequired: 3,
                    receiptImage: "https://example.com/receipt.png"
                });

            expect(res.status).to.equal(201);
            expect(res.body.group).to.have.property("dealTitle", "Test Deal");
        });
    });

    describe("GET /api/group/get-groups", () => {
        it("should return all groups", async () => {
            await Group.create({
                dealId: "60d21b4667d0d8992e610c85",
                dealLogo: "logo",
                dealTitle: "Demo Deal",
                dealDescription: "Just a test",
                storeName: "Store",
                storeLocation: "Location",
                totalValue: 99,
                discount: 10,
                expiryDate: new Date(),
                membersRequired: 2
            });

            const res = await request(app)
                .get("/api/group/get-groups")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body.length).to.be.at.least(1);
        });
    });

    describe("PUT /api/group/update-group-status/:id", () => {
        it("should update group status", async () => {
            const group = await Group.create({
                dealId: "60d21b4667d0d8992e610c85",
                dealLogo: "logo",
                dealTitle: "Demo",
                dealDescription: "desc",
                storeName: "store",
                storeLocation: "loc",
                totalValue: 100,
                discount: 10,
                expiryDate: new Date(),
                membersRequired: 3
            });

            const res = await request(app)
                .put(`/api/group/update-group-status/${group._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ status: "completed" });

            expect(res.status).to.equal(200);
            expect(res.body.group.status).to.equal("completed");
        });
    });
    describe("PUT /api/group/update-members-required/:id", () => {
        it("should update membersRequired", async () => {
            const group = await Group.create({
                dealId: "60d21b4667d0d8992e610c85",
                dealLogo: "logo",
                dealTitle: "Demo",
                dealDescription: "desc",
                storeName: "store",
                storeLocation: "loc",
                totalValue: 100,
                discount: 10,
                expiryDate: new Date(),
                membersRequired: 3
            });

            const res = await request(app)
                .put(`/api/group/update-members-required/${group._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ membersRequired: 5 });

            expect(res.status).to.equal(200);
            expect(res.body.group.membersRequired).to.equal(5);
        });
    });







});
