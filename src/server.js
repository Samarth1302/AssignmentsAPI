const express = require("express");
const bodyParser = require("body-parser");
const assignmentRoutes = require("./routes/assignment");
const authRoutes = require("./routes/auth");
const submissionRoutes = require("./routes/submission");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use("/auth", authRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/submissions", submissionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
