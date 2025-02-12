const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./config");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);


const habitRoutes = require("./routes/habits");
// app.use("/api/add", habitRoutes);
app.use("/api/habits", habitRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
