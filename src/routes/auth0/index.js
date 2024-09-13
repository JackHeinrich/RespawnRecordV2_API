const express = require("express");
const router = express.Router();

// Import your DynamoDB route files
const addNickNameTag = require("./addNickNameTag");
const getUsers = require("./getUsers");
const getUser = require("./getUser");
// Add more route files as needed

// Use the routes
router.use("/add_nickname_tag", addNickNameTag);
router.use("/get_users", getUsers);
router.use("/get_user", getUser);
// Add more routes as needed

module.exports = router;
