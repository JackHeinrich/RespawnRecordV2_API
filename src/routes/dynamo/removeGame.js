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

// Define the route to remove a game from a user's games set in DynamoDB
router.put("/:userNickname/:gameId", async (req, res) => {
  const { userNickname, gameId } = req.params;

  // Validate gameId to ensure it's a number
  if (isNaN(gameId)) {
    return res.status(400).json({
      message: "Invalid gameId. It must be a number.",
    });
  }

  try {
    // Check if the user exists
    const exists = await userExists(userNickname);

    if (!exists) {
      return res.status(404).json({
        message: `User with nickname ${userNickname} does not exist.`,
      });
    }

    const command = new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: {
        nickname: { S: userNickname }, // Use nickname as the key
      },
      UpdateExpression: "DELETE games :gameId",
      ExpressionAttributeValues: {
        ":gameId": { NS: [gameId] }, // Remove the gameId from the set
      },
      ReturnValues: "UPDATED_NEW", // Return updated values
    });

    const response = await client.send(command);

    res.json({
      message: `Game with id ${gameId} has been removed from user with nickname ${userNickname}.`,
      updatedAttributes: response.Attributes,
    });
  } catch (error) {
    console.error("Error removing game:", {
      message: error.message,
    });

    res.status(500).json({
      message: `Failed to remove game from user's games set in DynamoDB: ${error.message}`,
    });
  }
});

module.exports = router;
