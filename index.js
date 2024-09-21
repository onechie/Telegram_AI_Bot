import express from "express";
import { handler } from "./controller/index.js";
const PORT = process.env.PORT || 4040;
const app = express();

app.use(express.json());
app.post("*", async (req, res) => {
  console.log(req.body);
  res.send(await handler(req));
});
app.get("*", async (req, res) => {
  res.send(await handler(req));
});

app.listen(PORT, (error) => {
  if (error) console.log(error);
  console.log("Server is running on PORT:", PORT);
});
