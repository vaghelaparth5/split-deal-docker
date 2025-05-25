const http = require("http");
const { expect } = require("chai");
const ioClient = require("socket.io-client");
const request = require("supertest");
const app = require("../../../src/app");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../../src/models/User");
const Group = require("../../../src/models/Group");
const Deal = require("../../../src/models/Deal");
const { connect, clear, close } = require("../../helpers/db");
const initializeSocket = require("../../../src/socket"); // make sure this exists and works

let server, io, clientSocket, token;
const SECRET = process.env.JWT_SECRET || "testsecret";

describe("Socket Events - E2E Tests", function () {
  this.timeout(15000); // Increase timeout for async ops

  before(async () => {
    await connect();

    const httpServer = http.createServer(app);
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    initializeSocket(io); // Register socket event listeners
    app.set("io", io);
    server = httpServer.listen(0);

    const port = server.address().port;
    clientSocket = ioClient.connect(`http://localhost:${port}`, {
      transports: ["websocket"],
      forceNew: true,
    });

    await new Promise((resolve) => {
      clientSocket.on("connect", () => {
        console.log("✅ Client socket connected");
        resolve();
      });
    });

    const user = await User.create({
      user_email: "testsocket@example.com",
      user_password: "hashedpass",
      name: "Socket User",
    });

    token = jwt.sign({ user_id: user._id }, SECRET, { expiresIn: "1h" });
  });

  afterEach(clear);

  after(async () => {
    clientSocket.disconnect();
    server.close();
    await close();
  });

  it("should receive 'new_deal' when a deal is created", function (done) {
    clientSocket.once("new_deal", (data) => {
      try {
        expect(data.deal.title).to.equal("Pizza Deal");
        done();
      } catch (err) {
        done(err);
      }
    });

    request(app)
      .post("/api/deal/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Pizza Deal",
        description: "50% off",
        price: 100,
        original_price: 200,
        deadline: new Date(Date.now() + 100000),
        location: "Melbourne",
        max_participants: 5,
        category: "Food",
        image_url: "https://example.com/pizza.jpg",
      })
      .expect(201)
      .end((err) => err && done(err));
  });

  

  it("should receive 'new_group' when group is created", function (done) {
    clientSocket.once("new_group", (data) => {
      try {
        expect(data.group.dealTitle).to.equal("Live Group");
        done();
      } catch (err) {
        done(err);
      }
    });

    request(app)
      .post("/api/group/create-group")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dealId: new mongoose.Types.ObjectId(),
        dealLogo: "logo",
        dealTitle: "Live Group",
        dealDescription: "desc",
        storeName: "test",
        storeLocation: "city",
        totalValue: 300,
        discount: 30,
        expiryDate: new Date(Date.now() + 100000),
        membersRequired: 5,
        receiptImage: "https://img",
      })
      .expect(201)
      .end((err) => err && done(err));
  });

 
});
