const express = require("express");
require("dotenv").config();

const axios = require("axios");

const router = express.Router();
const AUTH_DOMAIN = process.env.AUTH0_DOMAIN;

const getManagementAccessToken = require("./util/getManagementAccessToken");

// Define the route to update a user's nickname
router.patch("/:userId/:nickname", async (req, res) => {
  try {
    const { userId, nickname } = req.params;
    const accessToken = await getManagementAccessToken();

    // Axios request configuration
    const options = {
      method: "PATCH",
      url: `https://${AUTH_DOMAIN}/api/v2/users/${userId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        user_metadata: { nickname },
      },
    };

    // Make the Axios request
    const response = await axios(options);

    if (response.status === 200) {
      return res
        .status(200)
        .json({ message: "Nickname updated successfully." });
    }

    return res.status(response.status).json({ message: response.data.message });
  } catch (error) {
    console.error("Error updating nickname:", error);
    // Handle error from Axios, which may be in `error.response`
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({ message: errorMessage });
  }
});

module.exports = router;
