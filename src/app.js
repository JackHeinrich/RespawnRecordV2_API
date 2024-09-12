const express = require("express");

const app = express();

const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Route Definitions
const idgbRoutes = require("./routes/igdb/index");
const dynamoRoutes = require("./routes/dynamo/index");
const auth0Routes = require("./routes/auth0/index");
app.use("/api/igdb", idgbRoutes);
app.use("/api/dynamo", dynamoRoutes);
app.use("/api/auth0", auth0Routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
