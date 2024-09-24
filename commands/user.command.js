import {
  createUser,
  updateName,
  updateGender,
} from "../controllers/user.controller.js";
import { sendRequest } from "../config/axios.js"; // Import the request function

const errorMessages = {
  101: `Oops! 😔 Something went wrong. Please try again or check your input and give it another shot. If the issue persists, feel free to reach out for help!`,
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

// Start command
export const startCommand = async (chat_id) => {
  try {
    const user = await createUser(chat_id);
    if (user) {
      const welcomeMessage = user.name
        ? `Welcome back, ${user.name}! 😊`
        : `Hello, it's great to meet you! 😊 You can personalize your experience by setting your name. Just type "/set_name your_name", and I'll remember it for future chats!`;

      return sendMessage(chat_id, welcomeMessage);
    }
    return sendMessage(chat_id, errorMessages[101]);
  } catch (error) {
    console.error("Error in startCommand:", error.message);
    return sendMessage(chat_id, errorMessages[101]);
  }
};

// Set name command
export const setNameCommand = async (chat_id, newName) => {
  try {
    // Validate if name is provided
    if (!newName || newName.trim() === "") {
      return sendMessage(
        chat_id,
        `Please provide a valid name. Usage: "/set_name your_name"`
      );
    }

    const updatedUser = await updateName(chat_id, newName.trim());
    if (updatedUser) {
      return sendMessage(
        chat_id,
        `Thank you! Your name has been set to ${newName}. 😊 If you'd like to update it again, feel free to use the "/set_name your_name" command anytime!`
      );
    } else {
      return sendMessage(chat_id, errorMessages[101]);
    }
  } catch (error) {
    console.error("Error in setNameCommand:", error.message);
    return sendMessage(chat_id, errorMessages[101]);
  }
};

// Set gender command
export const setGenderCommand = async (chat_id, newGender) => {
  try {
    // Validate gender input
    const validGenders = ["male", "female", "other"];
    if (!newGender || !validGenders.includes(newGender.toLowerCase())) {
      return sendMessage(
        chat_id,
        `Please provide a valid gender ("male", "female", or "other"). Usage: "/set_gender your_gender"`
      );
    }

    const updatedUser = await updateGender(chat_id, newGender.toLowerCase());
    if (updatedUser) {
      return sendMessage(
        chat_id,
        `Thank you! Your gender has been set to ${newGender}. 🌟 If you'd like to update it, just use the "/set_gender your_gender" command anytime!`
      );
    } else {
      return sendMessage(chat_id, errorMessages[101]);
    }
  } catch (error) {
    console.error("Error in setGenderCommand:", error.message);
    return sendMessage(chat_id, errorMessages[101]);
  }
};
