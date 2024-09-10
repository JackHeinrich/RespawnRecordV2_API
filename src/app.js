const express = require("express");

const app = express();

const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Route Definitions
const idgbRoutes = require("./routes/igdbRoutes");
app.use("/api/igdb", idgbRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
