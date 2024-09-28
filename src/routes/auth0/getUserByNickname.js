const express = require("express");
require("dotenv").config();
const axios = require("axios");

const router = express.Router();
const AUTH_DOMAIN = process.env.AUTH0_DOMAIN;

const getManagementAccessToken = require("./util/getManagementAccessToken");

// Define the route to get a user by their nickname
router.get("/:nickname", async (req, res) => {
  try {
    const { nickname } = req.params; // Get nickname from the route parameters
    const accessToken = await getManagementAccessToken();

    // Axios request configuration to search users by nickname
    const options = {
      method: "GET",
      url: `https://${AUTH_DOMAIN}/api/v2/users`, // Fetch users based on search criteria
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        q: `user_metadata.nickname:"${nickname}"`, // Query to search by nickname
        search_engine: "v3", // Using search engine version 3 in Auth0
      },
    };

    // Make the Axios request to search users by nickname
    const response = await axios(options);

    if (response.status === 200) {
      const users = response.data;
      if (users.length > 0) {
        return res.status(200).json(users[0]); // Return the first user found with the nickname
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    }

    return res.status(response.status).json({ message: response.data.message });
  } catch (error) {
    console.error("Error fetching user by nickname:", error);
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({ message: errorMessage });
  }
});

module.exports = router;
