// import express from "express";
// import { handler } from "./controller/index.js";
// const PORT = process.env.PORT || 4040;
// const app = express();

// app.use(express.json());
// app.post("*", async (req, res) => {
//   console.log(req.body);
//   res.send(await handler(req));
// });
// app.get("*", async (req, res) => {
//   res.send(await handler(req));
// });

// app.listen(PORT, (error) => {
//   if (error) console.log(error);
//   console.log("Server is running on PORT:", PORT);
// });

import express from "express";
import { handler } from "./controller/index.js";

const PORT = process.env.PORT || 4040;
const app = express();

app.use(express.json());

app.post("*", async (req, res) => {
  console.log(req.body);
  await handler(req);
  res.sendStatus(200); // Send a 200 OK response
});

app.get("*", (req, res) => {
  res.sendStatus(404); // Respond with 404 for unsupported GET requests
});

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
