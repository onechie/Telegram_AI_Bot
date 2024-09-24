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
