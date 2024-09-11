const express = require("express");
const router = express.Router();

// Import your IGDB route files
const frontPageGames = require("./frontPageGames");
const gameById = require("./gameById");
const gamesByQuery = require("./gamesByQuery");
// Add more route files as needed

// Use the routes
router.use("/frontpage_games", frontPageGames);
router.use("/game_by_id", gameById);
router.use("/get_games_by_query", gamesByQuery);
// Add more routes as needed

module.exports = router;
