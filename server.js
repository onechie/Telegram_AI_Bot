import express from "express"; // Import express framework
import { handler } from "./controller/index.js"; // Import the main handler function

const PORT = process.env.PORT || 4040; // Set the port for the server
const app = express(); // Create an instance of the Express app

app.use(express.json()); // Middleware to parse JSON request bodies

// Handle POST requests to any endpoint
app.post("*", async (req, res) => {
  console.log(req.body); // Log the request body for debugging
  await handler(req); // Call the main handler function
  res.sendStatus(200); // Send a 200 OK response after processing
});

// Handle unsupported GET requests by sending a 404 response
app.get("*", (req, res) => {
  res.sendStatus(404);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT); // Log the server status
});

// TODO: Add database
// TODO: Add commands set nickname, gender
// TODO: enhance the write letter prompt