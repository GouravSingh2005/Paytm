const express = require("express");
const mainRouter = require("./routes/index");
const cors = require("cors");
require("dotenv").config();  // dotenv se .env load

const app = express();

const PORT = process.env.PORT || 3001;

// Docker + Local CORS setup
const FRONTEND_URLS = [
  process.env.FRONTEND_URL_LOCAL || "http://localhost:5173",  // local dev
  process.env.FRONTEND_URL_DOCKER || "http://frontend:8081" ,
  process.env.FRONTEND_URL_DOCKER || "http://frontend:3000"   // frontend container
];

app.use(cors());

// JSON parsing
app.use(express.json());

// Routes
app.use("/api/v1", mainRouter);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
