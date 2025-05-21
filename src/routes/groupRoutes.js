const express = require("express");
const router = express.Router();
const {updateGroupStatus, createGroup, getAllGroups, getGroupById, deleteGroup, updateReceiptImage} = require("../controllers/groupController");


const authMiddleware = require("../middleware/authMiddleware");

//  Route to create a new group
router.post("/create-group",authMiddleware, createGroup);

//  Route to get all groups
router.get("/get-groups", getAllGroups);

//  Route to get a group by ID
router.get("/get-group/:id",authMiddleware, getGroupById);

//  Route to update group status
router.put("/update-group-status/:id",authMiddleware, updateGroupStatus);

router.delete("/delete-group/:id", authMiddleware, deleteGroup);

//Route to update receipt image based on group ID
router.put("/update-receipt/:id", authMiddleware, updateReceiptImage);

module.exports = router;
