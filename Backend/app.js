const express = require("express");
require("dotenv").config();
require("./conn/conn");
const cors = require("cors");
const userRouter = require("./routes/UserRoute");
const taskRouter = require("./routes/TaskRoute");
// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// api endpoint
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("Api working");
});

app.listen(port, () => {
  console.log(`server is running on http.//localhost:${port}`);
});
