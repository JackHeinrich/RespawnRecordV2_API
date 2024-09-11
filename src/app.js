const express = require("express");

const app = express();

const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Route Definitions
const idgbRoutes = require("./routes/igdbRoutes");
const dynamoRoutes = require("./routes/dynamoRoutes");
app.use("/api/igdb", idgbRoutes);
app.use("/api/dynamo", dynamoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
