// src/util/userExists.js
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const TABLE_NAME = "RespawnRecordUsers";

async function userExists(nickname) {
  try {
    const command = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        nickname: { S: nickname }, // Ensure the nickname is stored as a Number
      },
    });

    const response = await client.send(command);

    // Return true if the user exists, otherwise false
    return response.Item ? true : false;
  } catch (error) {
    console.error("Error checking if user exists:", {
      message: error.message,
    });
    throw new Error(`Failed to check if user exists: ${error.message}`);
  }
}

module.exports = userExists;
