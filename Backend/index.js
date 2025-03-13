const express = require("express");
const mainRouter = require("./routes/index");
const cors = require("cors");

const app = express();

app.use(cors());


app.use(cors({
  origin: "http://localhost:5173",  // ✅ Frontend URL allow kar raha hai
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.use(express.json());

app.use("/api/v1", mainRouter); 

app.listen(3000, () => console.log("Server running on port 3000"));
