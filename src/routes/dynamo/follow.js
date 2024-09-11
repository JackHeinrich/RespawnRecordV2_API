const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const userExists = require("./util/userExists"); // Adjust path if needed

const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const TABLE_NAME = "RespawnRecordUsers";

// Define the route to follow another user
router.put("/:nickname/:nicknameToFollow", async (req, res) => {
  const { nickname, nicknameToFollow } = req.params;

  // Validate nicknameToFollow to ensure it's a string
  if (typeof nicknameToFollow !== "string") {
    return res.status(400).json({
      message: "Invalid nicknameToFollow. It must be a string.",
    });
  }

  try {
    // Check if the user exists
    const userExistsFlag = await userExists(nickname);

    if (!userExistsFlag) {
      return res.status(404).json({
        message: `User with nickname ${nickname} does not exist.`,
      });
    }

    // Check if the user to follow exists
    const followExistsFlag = await userExists(nicknameToFollow);

    if (!followExistsFlag) {
      return res.status(404).json({
        message: `User with nickname ${nicknameToFollow} does not exist.`,
      });
    }

    // Update the user's following set
    const command = new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: {
        nickname: { S: nickname }, // Ensure the nickname key matches the schema: String (S)
      },
      UpdateExpression: "ADD following :nicknameToFollow",
      ExpressionAttributeValues: {
        ":nicknameToFollow": { SS: [nicknameToFollow] }, // Add the nicknameToFollow to the set
      },
      ReturnValues: "UPDATED_NEW", // Return updated values
    });

    const response = await client.send(command);

    res.json({
      message: `User with nickname ${nickname} is now following user with nickname ${nicknameToFollow}.`,
      updatedAttributes: response.Attributes,
    });
  } catch (error) {
    console.error("Error following user:", {
      message: error.message,
    });

    res.status(500).json({
      message: `Failed to follow user in DynamoDB: ${error.message}`,
    });
  }
});

module.exports = router;
