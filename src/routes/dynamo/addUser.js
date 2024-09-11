const express = require("express");
const router = express.Router();
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();
const userExists = require("./util/userExists"); // Adjust path if needed

const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const TABLE_NAME = "RespawnRecordUsers";

// Define the route to add a user to DynamoDB
router.post("/:nickname", async (req, res) => {
  let { nickname } = req.params;

  try {
    // Check if the user already exists using the utility function
    const exists = await userExists(nickname);

    if (exists) {
      return res.status(400).json({
        message: `User with nickname ${nickname} already exists.`,
      });
    }

    // Default values for new users
    const defaultUser = {
      nickname: { S: nickname.toString() }, // Ensure the nickname is stored as a Number
    };

    const putItemCommand = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: defaultUser,
    });

    await client.send(putItemCommand);

    res.json({
      message: `User with nickname ${nickname} has been added successfully with default values.`,
    });
  } catch (error) {
    console.error("Error adding user:", {
      message: error.message,
    });

    res.status(500).json({
      message: `Failed to add user to DynamoDB: ${error.message}`,
    });
  }
});

module.exports = router;
