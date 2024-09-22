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
const sendCustomMessage = async (id, messageText, name) => {
  let modPrompt = `Act like a messenger and your boss is chie as a male tell ${name} that your boss chie want to tell ${messageText} with a message to brighten her day no signature part`;

  // Generate a response using the Google AI model for regular messages
  const result = await model.generateContent(modPrompt);
  const text = result?.response?.text() || "Hello, niks!";
  sendRequest("post", {
    method: "sendMessage",
    params: {
      chat_id: id, // Chat ID of the user
      text,
    },
  });
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
    const command = messageText.slice(1); // Extract the command without "/"
    switch (command) {
      case "start":
        return sendMessage(
          messageObj,
          "Hi! I'm a bot. I can help you to get started"
        );
      case "niks": //5711448416
        return sendCustomMessage("7368334563", command.slice(5), "niks");

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
