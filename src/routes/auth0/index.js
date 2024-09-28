const express = require("express");
const router = express.Router();

// Import your DynamoDB route files
const addNickNameTag = require("./addNickNameTag");
const getUsers = require("./getUsers");
const getUser = require("./getUser");
const follow = require("./follow");
const unfollow = require("./unfollow");
const getUserByNickname = require("./getUserByNickname");
const addGame = require("./addGame");
const removeGame = require("./removeGame");
// Add more route files as needed

// Use the routes
router.use("/add_nickname_tag", addNickNameTag);
router.use("/get_users", getUsers);
router.use("/get_user", getUser);
router.use("/follow", follow);
router.use("/unfollow", unfollow);
router.use("/get_user_by_nickname", getUserByNickname);
router.use("/add_game", addGame);
router.use("/remove_game", removeGame);
// Add more routes as needed

module.exports = router;
