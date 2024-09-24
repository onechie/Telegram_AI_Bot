import User from "../models/user.model.js";
import { sendRequest } from "../config/axios.js"; // Import the request function

// Function to send a message back to the user
export const sendMessage = (messageObj, messageText) => {
  return sendRequest("post", {
    method: "sendMessage",
    params: {
      chat_id: messageObj.chat.id, // Chat ID of the user
      text: messageText, // Message text to be sent
    },
  });
};
// Function to send a letter to other user
export const writeLetter = async (
  gender,
  senderId,
  senderName,
  receiverId,
  receiverName,
  message
) => {
  const prompt = `Imagine yourself as a warm-hearted, friendly messenger of ${gender}. Deliver an uplifting message to ${receiverName} on behalf of ${senderName}. The message to convey is: "${message}". Make sure the tone is bright, positive, and filled with encouragement, leaving the recipient feeling joyful and appreciated. with no signature part.`;

  try {
    // Generate a response using the Google AI model
    const result = await model.generateContent(prompt);
    const text = result?.response?.text();
    sendMessage(
      { chat: { id: senderId } },
      `${text} : [sent to ${receiverName}]`
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
// Function to create a user data
export const createUser = async (chat_id) => {
  const newUser = new User({ chat_id });
  try {
    await newUser.save();
    sendMessage(
      { chat: { id: chat_id } },
      `Hello, it's great to meet you! 😊 You can personalize your experience by setting your name. Just type "/set_name your_name", and I'll remember it for future chats!`
    );
  } catch (error) {
    console.error("Error creating user:", error.message);
    `Something went wrong! 😞`;
  }
};
// Function to set name
export const setName = () => {};
