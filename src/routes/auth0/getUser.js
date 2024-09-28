const express = require("express");
require("dotenv").config();
const axios = require("axios");

const router = express.Router();
const AUTH_DOMAIN = process.env.AUTH0_DOMAIN;

const getManagementAccessToken = require("./util/getManagementAccessToken");

// Define the route to get a user by their user_id
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params; // Get user_id from the route parameters
    const accessToken = await getManagementAccessToken();

    // Axios request configuration
    const options = {
      method: "GET",
      url: `https://${AUTH_DOMAIN}/api/v2/users/${user_id}`, // Directly fetch the user by user_id
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    // Make the Axios request to fetch the user by user_id
    const response = await axios(options);

    if (response.status === 200) {
      return res.status(200).json(response.data); // Return the user data
    }

    return res.status(response.status).json({ message: response.data.message });
  } catch (error) {
    console.error("Error fetching user by user_id:", error);
    // Handle error from Axios, which may be in error.response
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({ message: errorMessage });
  }
});

module.exports = router;
