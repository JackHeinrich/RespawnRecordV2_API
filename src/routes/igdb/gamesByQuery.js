const express = require("express");
const router = express.Router();
const igdb = require("igdb-api-node").default;
require("dotenv").config(); // Load environment variables

const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

// Define the GET route to fetch game by name and genre using query parameters
router.get("/", async (req, res) => {
  try {
    const client = igdb(CLIENT_ID, IGDB_ACCESS_TOKEN);

    let { name, genre, page } = req.query;

    const offset = page * 12;

    // Create a query to get all games with specified name or genre
    const query = client
      .fields([
        "name",
        "cover.url",
        "first_release_date",
        "genres.name",
        "total_rating",
        "summary",
      ])
      .limit(10)
      .offset(offset)
      .where("category = 0");
    if (name && name !== "any") {
      query.search(`${name}`);
    }

    // Conditionally add the genre filter
    if (genre && genre !== "any") {
      query.where(`genres = (${genre})`); // Adjust based on API requirements
      query.sort("total_rating_count", "desc");
    }

    const response = await query.request("/games");

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
