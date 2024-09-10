const axios = require("axios");

const getFrontPageGames = async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/frontpage_games");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching IGDB games:", error.message);
    res.status(500).json({ message: "Error fetching igdb games" });
  }
};

module.exports = { getFrontPageGames };
