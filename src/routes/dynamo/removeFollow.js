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

// Define the route to remove a follow
router.delete("/:userNickname/:nicknameToUnfollow", async (req, res) => {
  const { userNickname, nicknameToUnfollow } = req.params;

  try {
    // Check if the user exists
    const userExistsFlag = await userExists(userNickname);

    if (!userExistsFlag) {
      return res.status(404).json({
        message: `User with nickname ${userNickname} does not exist.`,
      });
    }

    // Check if the user to unfollow exists
    const unfollowExistsFlag = await userExists(nicknameToUnfollow);

    if (!unfollowExistsFlag) {
      return res.status(404).json({
        message: `User with nickname ${nicknameToUnfollow} does not exist.`,
      });
    }

    // Update the user's following set
    const command = new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: {
        nickname: { S: userNickname }, // Use nickname as the key
      },
      UpdateExpression: "DELETE following :nicknameToUnfollow",
      ExpressionAttributeValues: {
        ":nicknameToUnfollow": { SS: [nicknameToUnfollow] }, // Remove the nicknameToUnfollow from the set
      },
      ReturnValues: "UPDATED_NEW", // Return updated values
    });

    const response = await client.send(command);

    res.json({
      message: `User with nickname ${userNickname} has unfollowed user with nickname ${nicknameToUnfollow}.`,
      updatedAttributes: response.Attributes,
    });
  } catch (error) {
    console.error("Error unfollowing user:", {
      message: error.message,
    });

    res.status(500).json({
      message: `Failed to unfollow user in DynamoDB: ${error.message}`,
    });
  }
});

module.exports = router;
