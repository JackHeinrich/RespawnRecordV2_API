const express = require("express");
require("dotenv").config();

const axios = require("axios");

const router = express.Router();
const AUTH_DOMAIN = process.env.AUTH0_DOMAIN;

const getManagementAccessToken = require("./util/getManagementAccessToken");

// Define the route to unfollow a user
router.patch("/:userId/:followUserId", async (req, res) => {
  try {
    const { userId, followUserId } = req.params;
    const accessToken = await getManagementAccessToken();

    // Get the current user data to retrieve the existing followed_users
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

    // Check if the user is being followed
    if (existingFollowedUsers.includes(followUserId)) {
      // Remove the followed userId from the array
      const updatedFollowedUsers = existingFollowedUsers.filter(
        (id) => id !== followUserId
      );

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
            followed_users: updatedFollowedUsers,
          },
        },
      };

      // Make the Axios request to update the user's metadata
      const updateResponse = await axios(options);

      if (updateResponse.status === 200) {
        return res
          .status(200)
          .json({ message: "User unfollowed successfully." });
      }

      return res
        .status(updateResponse.status)
        .json({ message: updateResponse.data.message });
    } else {
      return res.status(400).json({ message: "User is not being followed." });
    }
  } catch (error) {
    console.error("Error unfollowing user:", error);
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({ message: errorMessage });
  }
});

module.exports = router;
