// getManagementAccessToken.js
require("dotenv").config();
const axios = require("axios").default;

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

async function getManagementAccessToken() {
  console.log(AUTH0_DOMAIN);
  console.log(CLIENT_ID);
  console.log(CLIENT_SECRET);
  try {
    const options = {
      method: "POST",
      url: `https://${AUTH0_DOMAIN}/oauth/token`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      }),
    };

    const response = await axios.request(options);
    console.log("Access Token Response:", response.data); // Debugging output
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching access token:",
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = getManagementAccessToken;
