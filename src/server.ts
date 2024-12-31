import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = parseInt(process.env.PORT as string, 10);

app.get("/", (req, res) => {
  res.send("Hello World!" + undeclaredVariable);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
