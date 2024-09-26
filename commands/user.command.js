import {
  createUser,
  getUser,
  updateName,
  updateGender,
  updateUsername,
} from "../controllers/user.controller.js";
import { sendMessage } from "./general.command.js";
import { errorMessages } from "../utils/error_messages.js";

// Start command
export const startCommand = async (chat_id, username) => {
  try {
    const user = await createUser(chat_id, username);
    if (user) {
      const welcomeMessage = user.name
        ? `Welcome back, ${user.name}! 😊\nYou can check your info using "/get_me" command`
        : `Hello, it's great to meet you! 😊\nYou can personalize your experience by setting your name.\nJust type "/set_name your_name", and I'll remember it for future chats!`;

      return sendMessage(chat_id, welcomeMessage);
    }
    return sendMessage(chat_id, errorMessages[101]);
  } catch (error) {
    console.error("Error in startCommand:", error.message);
    return sendMessage(chat_id, errorMessages[101]);
  }
};

// Get info command
export const getMeCommand = async (chat_id) => {
  try {
    const user = await getUser({ chat_id });
    if (user) {
      return sendMessage(
        chat_id,
        `Username: ${user.username || "Not set"}\nName: ${
          user.name || "Not set"
        }\nGender: ${user.gender || "Not set"}\n`
      );
    }
    return sendMessage(
      chat_id,
      `It looks like you're not registered yet. Please use the "/start" command to register and get started!`
    );
  } catch (error) {
    console.error("Error in getMeCommand:", error.message);
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
        `Please provide a valid name.\nUsage: "/set_name your_name"\nTo remove just use "/set_name none"`
      );
    } else if (newName === "none") {
      await updateName(chat_id, "");
      return sendMessage(
        chat_id,
        `Your name has been cleared successfully. 🌟 \nIf you'd like to update it, just use the "/set_name your_name" command anytime!`
      );
    }

    const updatedUser = await updateName(chat_id, newName.trim());
    if (updatedUser) {
      return sendMessage(
        chat_id,
        `Thank you! Your name has been set to ${newName}. 😊\nIf you'd like to update it again, feel free to use the "/set_name your_name" command anytime!`
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
    if (newGender === "none") {
      await updateGender(chat_id, "");
      return sendMessage(
        chat_id,
        `Your gender has been cleared successfully. 🌟 \nIf you'd like to update it, just use the "/set_gender your_gender" command anytime!`
      );
    } else if (!newGender || !validGenders.includes(newGender.toLowerCase())) {
      return sendMessage(
        chat_id,
        `Please provide a valid gender:\n("male", "female", or "other").\nUsage: "/set_gender your_gender"\nTo remove just use "/set_gender none"`
      );
    }

    const updatedUser = await updateGender(chat_id, newGender.toLowerCase());
    if (updatedUser) {
      return sendMessage(
        chat_id,
        `Thank you! Your gender has been set to ${newGender}. 🌟 \nIf you'd like to update it, just use the "/set_gender your_gender" command anytime!`
      );
    } else {
      return sendMessage(chat_id, errorMessages[101]);
    }
  } catch (error) {
    console.error("Error in setGenderCommand:", error.message);
    return sendMessage(chat_id, errorMessages[101]);
  }
};

// Set username command
export const setUsernameCommand = async (chat_id, username) => {
  try {
    let updatedUser;
    // Validate if username is provided
    if (!username || username.trim() === "") {
      return sendMessage(
        chat_id,
        `Please provide a valid username.\nUsage: "/set_username your_username"\nTo remove just use "/set_username none"`
      );
    } else if (username === "none") {
      updatedUser = await updateUsername(chat_id, "");
      return sendMessage(
        chat_id,
        `Your username has been cleared successfully. 🌟 \nIf you'd like to update it, just use the "/set_username your_username" command anytime!`
      );
    }
    updatedUser = await updateUsername(chat_id, username);
    if (updatedUser.chat_id) {
      return sendMessage(
        chat_id,
        `Thank you! Your username has been set to ${username}. 🌟 \nIf you'd like to update it, just use the "/set_username your_username" command anytime!`
      );
    } else {
      return sendMessage(
        chat_id,
        `Sorry, the username "${username}" is already in use. Please try a different one! ❗`
      );
    }
  } catch (error) {
    console.error("Error in setGenderCommand:", error.message);
    return sendMessage(chat_id, errorMessages[101]);
  }
};
