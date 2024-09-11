const express = require("express");
const router = express.Router();
const igdb = require("igdb-api-node").default;
require("dotenv").config(); // Load environment variables

const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

// Define the GET route to fetch game by ID using query parameters
router.get("/", async (req, res) => {
  const { id } = req.query; // Get the ID from query parameters
  const client = igdb(CLIENT_ID, IGDB_ACCESS_TOKEN);

  if (!id) {
    return res.status(400).json({ error: "Game ID is required." });
  }

  try {
    // Fetch game data using the provided ID
    const response = await client
      .fields([
        "name",
        "cover.url",
        "first_release_date",
        "genres.name",
        "total_rating",
        "summary",
      ]) // Specify fields to fetch
      .where(`id = ${id}`) // Filter by game ID
      .request("/games");

    const game = response.data[0]; // Assuming the API returns an array of games

    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    res.json(game);
  } catch (error) {
    console.error("Error fetching game:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
