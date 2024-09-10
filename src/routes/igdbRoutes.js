const express = require("express");
const router = express.Router();
const igdb = require("igdb-api-node").default;
require("dotenv").config(); // Load environment variables

const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

// Define the route to fetch all games from IGDB
router.get("/frontpage_games", async (req, res) => {
  try {
    // Initialize the IGDB client with the Client ID and Access Token
    const client = igdb(CLIENT_ID, IGDB_ACCESS_TOKEN);

    // Extract limit and offset from the query parameters
    const page = parseInt(req.query.page) || 0; // if not specified, default to 0
    const limit = 4;
    const offset = page * limit;

    // Make a request to the IGDB API with specified fields
    const response = await client
      .fields(["name", "cover.url"]) // Specify fields to fetch
      .limit(limit) // Set the number of results to fetch
      .offset(offset) // Set the offset for pagination
      .where("status = 0")
      .where("category = 0")
      .where("total_rating_count > 5")
      .sort("total_rating_count", "desc")
      .request("/games"); // Endpoint to request

    // Send the data back to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors, log only the error message and status
    console.error("Error response:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Send an error message to the client
    res.status(500).json({
      message: `Failed to fetch data from IGDB API: ${error.message}`,
    });
  }
});

// Define the GET route to fetch game by ID using query parameters
router.get("/game_by_id", async (req, res) => {
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

// Define the GET route to fetch game by name and genre using query parameters
router.get("/get_games_by_search", async (req, res) => {
  try {
    const client = igdb(CLIENT_ID, IGDB_ACCESS_TOKEN);

    let { name, genre } = req.query;

    // Create a query to get all games with specified name or genre
    const response = await client
      .fields([
        "name",
        "cover.url",
        "first_release_date",
        "genres.name",
        "total_rating",
        "summary",
      ])
      .limit(10)
      .offset(0)
      .where("category = 0")
      .where(genre ? `genres = (${genre})` : "")
      .search(`${name ? name : ""}`)
      .request("/games");

    res.json(response.data);
  } catch (error) {
    console.error("Error response:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    res.status(500).json({
      message: `Failed to fetch data from IGDB API: ${error.message}`,
    });
  }
});

module.exports = router;
