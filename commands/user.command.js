import User from "../models/user.model.js";
import { sendRequest } from "../config/axios.js"; // Import the request function

const errorMessages = {
  101: errorMessages[101],
};

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
    sendMessage(senderId, `${text} : [sent to ${receiverName}]`); // send to sender
    return sendMessage(receiverId, text); // send to receiver
  } catch (error) {
    // Fallback message in case of API error or safety block
    let fallbackMessage = `Sorry, ${senderName}, it seems I cannot process that message right now. Please try again later!`;

    if (error?.response?.candidates?.[0]?.safetyRatings) {
      // Check if the error is related to safety concerns and adjust the message
      fallbackMessage = `Hey ${senderName}, your message seems a bit sensitive. Let's try saying it differently!`;
    }

    return sendMessage(senderId, fallbackMessage); // send to sender
  }
};
// Function to create a user data
export const createUser = async (chat_id) => {
  const newUser = new User({ chat_id });
  try {
    await newUser.save();
    sendMessage(
      chat_id,
      `Hello, it's great to meet you! 😊 You can personalize your experience by setting your name. Just type "/set_name your_name", and I'll remember it for future chats!`
    );
  } catch (error) {
    console.error("Error creating user:", error.message);
    sendMessage(chat_id, errorMessages[101]);
  }
};
// Function to set name
export const setName = async (chat_id, newName) => {
  try {
    const result = await User.findOneAndUpdate(
      { chat_id },
      { name: newName },
      { new: true }
    );
    if (!result) {
      sendMessage(chat_id, errorMessages[101]);
    } else {
      sendMessage(
        chat_id,
        `Thank you! Your name has been set successfully. 😊 If you'd like to update it again, feel free to use the "/set_name your_name" command anytime!`
      );
    }
  } catch (error) {
    console.error("Error updating user name:", error.message);
    sendMessage(chat_id, errorMessages[101]);
  }
};

// Function to set gender
export const setGender = async (chat_id, newGender) => {

  try {
    const result = await User.findOneAndUpdate(
      { chat_id },
      { gender: newGender },
      { new: true }
    );
    if (!result) {
      sendMessage(chat_id, errorMessages[101]);
    } else {
      sendMessage(
        chat_id,
        `Thank you! Your gender has been set successfully. 🌟 If you ever want to change it, just use the "/set_gender your_gender" command anytime!`
      );
    }
  } catch (error) {
    console.error("Error updating user gender:", error.message);
    sendMessage(chat_id, errorMessages[101]);
  }
};
