const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./config/dbConnection");
const { PORT, MONGODB_URI } = process.env;
const TaskRoute = require("./routes/taskRoutes");

app.use(cors());
app.use("/api", TaskRoute);

dbConnection(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
