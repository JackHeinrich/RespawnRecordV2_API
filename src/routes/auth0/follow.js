const express = require("express");
require("dotenv").config();

const axios = require("axios");

const router = express.Router();
const AUTH_DOMAIN = process.env.AUTH0_DOMAIN;

const getManagementAccessToken = require("./util/getManagementAccessToken");

// Define the route to follow a user
// Define the route to follow a user
router.patch("/:userId/:followUserId", async (req, res) => {
  try {
    const { userId, followUserId } = req.params; // Get userId and followUserId from route parameters
    const accessToken = await getManagementAccessToken();

    // First, get the current user data to retrieve the existing followed_users
    const userResponse = await axios.get(
      `https://${AUTH_DOMAIN}/api/v2/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const existingFollowedUsers =
      userResponse.data.user_metadata?.followed_users || [];

    // Check if the user is already being followed
    if (!existingFollowedUsers.includes(followUserId)) {
      // Add the new followed userId
      const updatedFollowedUsers = [...existingFollowedUsers, followUserId];

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
            followed_users: updatedFollowedUsers, // Use the updated array
          },
        },
      };

      // Make the Axios request to update the user's metadata
      const updateResponse = await axios(options);

      if (updateResponse.status === 200) {
        return res.status(200).json({ message: "User followed successfully." });
      }

      return res
        .status(updateResponse.status)
        .json({ message: updateResponse.data.message });
    } else {
      return res
        .status(400)
        .json({ message: "User is already being followed." });
    }
  } catch (error) {
    console.error("Error following user:", error);
    // Handle error from Axios, which may be in `error.response`
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({ message: errorMessage });
  }
});

module.exports = router;
