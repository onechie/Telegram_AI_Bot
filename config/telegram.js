import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Google AI library
import dotenv from "dotenv";
import {
  sendMessage,
  writeLetter,
  createUser,
  setName,
} from "../commands/user.command.js";
// Load environment variables
dotenv.config();

// Initialize Google AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// Specify the model to use for generating content
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to handle incoming messages
export const handleMessage = async (req) => {
  const messageObj = req.body?.message;
  if (!messageObj) {
    console.error("Received an undefined message object");
    return; // Exit if the message object is not valid
  }

  // Get the text from the message or edited message
  const messageText = messageObj.text || messageObj.edited_message?.text || "";

  // Check if the message is a command (starts with "/")
  if (messageText.startsWith("/")) {
    const [commandParts, senderName, ...messageParts] = messageText.split(" ");
    const command = commandParts.slice(1).toLowerCase(); // Get the command without "/"
    const message = messageParts.join(" "); // Combine the remaining words

    switch (command) {
      case "start":
        return createUser(messageObj.chat.id);
      case "to_chie":
        return writeLetter(
          "female",
          messageObj.chat.id,
          senderName,
          process.env.CHIE,
          "Chie",
          message
        );
      case "to_niks":
        return writeLetter(
          "male",
          messageObj.chat.id,
          senderName,
          process.env.NIKS,
          "Niks",
          message
        );

      default:
        return sendMessage(messageObj, "Hey hi, I don't know that command");
    }
  } else {
    // Generate a response using the Google AI model for regular messages
    const result = await model.generateContent(messageText);
    const text = result?.response?.text() || "Sorry, I can't answer that!";
    return sendMessage(messageObj, text); // Send the generated response
  }
};
