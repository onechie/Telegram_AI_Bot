import { handleMessage } from "./lib/Telegram.js"; // Import the message handler

// Main handler function for incoming requests
export const handler = async (req) => {
  const messageObj = req.body?.message; // Extract the message object from the request body
  if (messageObj) {
    await handleMessage(messageObj); // Process the message if it exists
  }
};
