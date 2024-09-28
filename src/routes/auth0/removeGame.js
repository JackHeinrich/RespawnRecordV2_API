const getManagementAccessToken = require("./util/getManagementAccessToken");

const express = require("express");
require("dotenv").config();

const axios = require("axios");

const router = express.Router();
const AUTH_DOMAIN = process.env.AUTH0_DOMAIN;

// Define the route to remove a game
router.patch("/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from route parameters
    const { gameId } = req.body; // Get gameId from request body
    const accessToken = await getManagementAccessToken();

    // First, get the current user data to retrieve the existing games
    const userResponse = await axios.get(
      `https://${AUTH_DOMAIN}/api/v2/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const existingGames = userResponse.data.user_metadata?.games || [];

    // Check if the game is in the user's games list
    if (existingGames.includes(gameId)) {
      // Remove the gameId from the existing games array
      const updatedGames = existingGames.filter((game) => game !== gameId);

      // Axios request configuration to update the user's metadata
      const options = {
        method: "PATCH",
        url: `https://${AUTH_DOMAIN}/api/v2/users/${userId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: {
          user_metadata: {
            ...userResponse.data.user_metadata,
            games: updatedGames, // Use the updated array
          },
        },
      };

      // Make the Axios request to update the user's metadata
      const updateResponse = await axios(options);

      if (updateResponse.status === 200) {
        return res.status(200).json({ message: "Game removed successfully." });
      }

      return res
        .status(updateResponse.status)
        .json({ message: updateResponse.data.message });
    } else {
      return res.status(400).json({ message: "Game is not in the list." });
    }
  } catch (error) {
    console.error("Error removing game:", error);
    // Handle error from Axios, which may be in `error.response`
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({ message: errorMessage });
  }
});

module.exports = router;
