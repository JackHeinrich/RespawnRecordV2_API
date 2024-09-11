const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();
const express = require("express");
const router = express.Router();

const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const TABLE_NAME = "RespawnRecordUsers";

// Define the route to fetch all users from DynamoDB
router.get("/", async (req, res) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await client.send(command);

    // Send the data back to the client
    res.json(response.Items);
  } catch (error) {
    console.error("Error fetching users:", {
      message: error.message,
    });

    res.status(500).json({
      message: `Failed to fetch data from DynamoDB: ${error.message}`,
    });
  }
});

module.exports = router;
