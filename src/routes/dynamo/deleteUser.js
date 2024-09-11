// src/routes/dynamo/deleteUser.js
const express = require("express");
const router = express.Router();
const userExists = require("./util/userExists"); // Adjust path if needed
const {
  DynamoDBClient,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const TABLE_NAME = "RespawnRecordUsers";

// Define the route to delete a user from DynamoDB
router.delete("/:nickname", async (req, res) => {
  const { nickname } = req.params;

  try {
    // Check if user exists before attempting to delete
    const exists = await userExists(nickname);
    if (!exists) {
      return res.status(404).json({
        message: `User with nickname ${nickname} does not exist.`,
      });
    }

    const command = new DeleteItemCommand({
      TableName: TABLE_NAME,
      Key: {
        nickname: { S: nickname }, // Ensure the key matches the schema: String (S)
      },
    });

    await client.send(command);

    res.json({
      message: `User with nickname ${nickname} has been deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting user:", {
      message: error.message,
    });

    res.status(500).json({
      message: `Failed to delete user from DynamoDB: ${error.message}`,
    });
  }
});

module.exports = router;
