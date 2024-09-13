const express = require("express");
require("dotenv").config();
const axios = require("axios");

const router = express.Router();
const AUTH_DOMAIN = process.env.AUTH0_DOMAIN;

const getManagementAccessToken = require("./util/getManagementAccessToken");

// Define the route to get a user by their nickname
router.get("/:nickname", async (req, res) => {
  try {
    const { nickname } = req.params;
    const accessToken = await getManagementAccessToken();

    // Axios request configuration
    const options = {
      method: "GET",
      url: `https://${AUTH_DOMAIN}/api/v2/users`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    // Make the Axios request to fetch all users
    const response = await axios(options);

    if (response.status === 200) {
      // Filter users based on nickname metadata
      const users = response.data;
      const user = users.find(
        (user) => user.user_metadata && user.user_metadata.nickname === nickname
      );

      if (user) {
        return res.status(200).json(user);
      } else {
        return res
          .status(404)
          .json({ message: `User with nickname ${nickname} not found.` });
      }
    }

    return res.status(response.status).json({ message: response.data.message });
  } catch (error) {
    console.error("Error fetching user by nickname:", error);
    // Handle error from Axios, which may be in `error.response`
    const errorMessage = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({ message: errorMessage });
  }
});

module.exports = router;
