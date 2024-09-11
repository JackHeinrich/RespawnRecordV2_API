const express = require("express");
const router = express.Router();

// Import your DynamoDB route files
const addUser = require("./addUser");
const deleteUser = require("./deleteUser");
const getUsers = require("./getUsers");
const addGame = require("./addGame");
const removeGame = require("./removeGame");
const follow = require("./follow");
const removeFollow = require("./removeFollow");
const getUser = require("./getUser");
// Add more route files as needed

// Use the routes
router.use("/add_user", addUser);
router.use("/delete_user", deleteUser);
router.use("/get_users", getUsers);
router.use("/add_game", addGame);
router.use("/remove_game", removeGame);
router.use("/follow", follow);
router.use("/remove_follow", removeFollow);
router.use("/get_user", getUser);
// Add more routes as needed

module.exports = router;
