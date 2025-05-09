const express = require("express");
const router = express.Router();
const {updateGroupStatus} = require("../controllers/groupController");

router.put("/update-group-status/:id",authMiddleware, updateGroupStatus);