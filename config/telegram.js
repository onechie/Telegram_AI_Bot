import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Google AI library
import dotenv from "dotenv";
import {
  sendMessage,
  writeLetter,
  startCommand,
  setNameCommand,
  setGenderCommand,
  getMeCommand,
} from "../commands/user.command.js";
// Load environment variables
dotenv.config();

// Initialize Google AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// Specify the model to use for generating content
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to handle incoming messages
export const handleMessage = async (req) => {
  try {
    const messageObj = req.body?.message;

    // Check if messageObj or messageText exists
    if (!messageObj || !messageObj.chat || !messageObj.chat.id) {
      console.error("Received an invalid or undefined message object");
      return; // Exit if the message object is invalid
    }

    const chatId = messageObj.chat.id;
    const messageText =
      messageObj.text?.trim() || messageObj.edited_message?.text?.trim() || "";

    // Early exit if the messageText is empty
    if (!messageText) {
      return sendMessage(
        chatId,
        "It seems like your message was empty! Please type something."
      );
    }

    // Check if the message is a command (starts with "/")
    if (messageText.startsWith("/")) {
      // Extract the command and arguments using regular expression
      const commandPattern = /^\/(\w+)(?:\s+(.+))?/;
      const matches = messageText.match(commandPattern);

      if (!matches || matches.length < 2) {
        return sendMessage(
          chatId,
          "Invalid command format. Please use the correct format."
        );
      }

      const command = matches[1].toLowerCase(); // Extract command without "/"
      const params = matches[2]?.trim() || ""; // Extract parameters if they exist

      // Split parameters into array for multi-argument commands
      const args = params.split(/\s+/).filter(Boolean);

      switch (command) {
        case "start":
          return await startCommand(chatId);

        case "get_me":
          return await getMeCommand(chatId);

        case "set_name":
          return await setNameCommand(chatId, args.join(" ")); // Allow multi-word names

        case "set_gender":
          return await setGenderCommand(chatId, args[0]?.toLowerCase() || ""); // Gender likely to be a single word

        // Add additional custom commands here
        // case "to_chie":
        //   return await writeLetter("female", chatId, senderName, process.env.CHIE, "Chie", args.join(" "));
        // case "to_niks":
        //   return await writeLetter("male", chatId, senderName, process.env.NIKS, "Niks", args.join(" "));

        default:
          return sendMessage(
            chatId,
            `Unknown command "${command}". \nTry using /start, /get_me /set_name, or /set_gender.`
          );
      }
    } else {
      // Handle regular messages by generating a response using the Google AI model
      const result = await model.generateContent(messageText);
      const responseText =
        result?.response?.text() || "Sorry, I couldn't understand that!";
      return sendMessage(chatId, responseText);
    }
  } catch (error) {
    console.error("Error handling message:", error.message);
    return sendMessage(
      req.body?.message?.chat?.id,
      "Oops! Something went wrong. Please try again."
    );
  }
};
