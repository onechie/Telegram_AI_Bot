import { sendRequest } from "./axios.js"; // Import the request function
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Google AI library
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Google AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// Specify the model to use for generating content
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to send a message back to the user
const sendMessage = (messageObj, messageText) => {
  return sendRequest("post", {
    method: "sendMessage",
    params: {
      chat_id: messageObj.chat.id, // Chat ID of the user
      text: messageText, // Message text to be sent
    },
  });
};

const writeLetter = async (
  senderId,
  senderName,
  receiverId,
  receiverName,
  message
) => {
  const prompt = `Act like a messenger and your boss ${senderName} as a male tells ${receiverName} that your boss ${senderName} wants to say: "${message}". Give a bright and positive message, with no signature part.`;
  try {
    // Generate a response using the Google AI model
    const result = await model.generateContent(prompt);
    const text = result?.response?.text();
    sendMessage(
      { chat: { id: senderId } },
      `Letter successfully sent to ${receiverName}:%0A"${text}"`
    ); // send to sender
    return sendMessage({ chat: { id: receiverId } }, text); // send to receiver
  } catch (error) {
    // Fallback message in case of API error or safety block
    let fallbackMessage = `Sorry, ${senderName}, it seems I cannot process that message right now. Please try again later!`;

    if (error?.response?.candidates?.[0]?.safetyRatings) {
      // Check if the error is related to safety concerns and adjust the message
      fallbackMessage = `Hey ${senderName}, your message seems a bit sensitive. Let's try saying it differently!`;
    }

    return sendMessage({ chat: { id: senderId } }, fallbackMessage); // send to sender
  }
};

// Function to handle incoming messages
export const handleMessage = async (messageObj) => {
  if (!messageObj) {
    console.error("Received an undefined message object");
    return; // Exit if the message object is not valid
  }

  // Get the text from the message or edited message
  const messageText = messageObj.text || messageObj.edited_message?.text || "";

  // Check if the message is a command (starts with "/")
  if (messageText.startsWith("/")) {
    const [commandParts, ...messageParts] = messageText.split(" ");
    const command = commandParts.slice(1).toLowerCase(); // Get the command without "/"
    const message = messageParts.join(" "); // Combine the remaining words

    switch (command) {
      case "start":
        return sendMessage(
          messageObj,
          "Hi! I'm a bot. I can help you to get started"
        );
      case "niks":
        return writeLetter(
          process.env.MY_ONE,
          "Niks",
          process.env.DEV,
          "Chie",
          message
        );
      case "chie":
        return writeLetter(
          process.env.DEV,
          "Chie",
          process.env.MY_ONE,
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
