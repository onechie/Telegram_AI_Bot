import { sendRequest } from "../config/axios.js"; // Import the request function

// Function to send a message back to the user
export const sendMessage = (id, messageText) => {
  return sendRequest("post", {
    method: "sendMessage",
    params: {
      chat_id: id, // Chat ID of the user
      text: messageText, // Message text to be sent
    },
  });
};

export const helpCommand = (chat_id) => {
  return sendMessage(
    chat_id,
    "Available commands:" +
      "\n/start - Initialize the bot and get a welcome message." +
      "\n/get_me - Retrieve your user information." +
      "\n/set_name <name> - Set your display name (supports multi-word names)." +
      "\n/set_gender <gender> - Set your gender (male, female, other)." +
      "\n/set_username <username> - Set your username." +
      '\n/send_to <recipient username> <message idea> - Construct a letter to a user with the help of AI. Just give an idea like "Good morning, how are you?" and the AI will generate a personalized letter.' +
      "\n/chavacano <text> - Translate the Chavacano text into Tagalog or English with the help of AI." +
      "\n/help - Show this help message."
  );
};
