const express = require('express');
require('dotenv').config()
const app = express();
const dbConfig = require("./config/dbConfig")
const port = process.env.PORT || 5000;

const usersRoutes = require("./routes/userRoutes");
app.use(express.json());

app.use("/api/users", usersRoutes);

app.listen(port, () => console.log(`server running on port ${port}`))