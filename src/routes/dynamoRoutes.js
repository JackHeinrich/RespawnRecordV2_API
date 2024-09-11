const AWS = require("aws-sdk");
require("dotenv").config();
const express = require("express");
const router = express.Router();

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "RespawnRecordUsers";

// Define the route to fetch all games from DynamoDB
router.get("/get_users", async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };
    const response = await dynamoClient.scan(params).promise();

    // Send the data back to the client
    res.json(response.Items);
  } catch (error) {
    // Handle errors
    console.error("Error fetching frontpage games:", {
      message: error.message,
    });

    // Send an error message to the client
    res.status(500).json({
      message: `Failed to fetch data from DynamoDB: ${error.message}`,
    });
  }
});

module.exports = router;
