const express = require("express");
const router = express.Router();

// Import your DynamoDB route files
const addNickNameTag = require("./addNickNameTag");
// Add more route files as needed

// Use the routes
router.use("/add_nickname_tag", addNickNameTag);
// Add more routes as needed

module.exports = router;
