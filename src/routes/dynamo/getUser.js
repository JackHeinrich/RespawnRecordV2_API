const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
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

// Define the route to get a user by nickname from DynamoDB
router.get("/:nickname", async (req, res) => {
  const { nickname } = req.params;

  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "nickname = :nickname",
      ExpressionAttributeValues: {
        ":nickname": { S: nickname },
      },
    });

    const response = await client.send(command);

    if (response.Items.length === 0) {
      return res.status(404).json({
        message: `User with nickname ${nickname} does not exist.`,
      });
    }

    res.json({
      message: `User with nickname ${nickname} retrieved successfully.`,
      user: response.Items[0], // Assuming nickname is unique and returns a single user
    });
  } catch (error) {
    console.error("Error retrieving user:", {
      message: error.message,
    });

    res.status(500).json({
      message: `Failed to retrieve user from DynamoDB: ${error.message}`,
    });
  }
});

module.exports = router;
