import User from "../models/user.model.js";

// Function to create a user data
export const createUser = async (chat_id, username) => {
  try {
    const existingUser = await User.findOne({ chat_id });
    if (existingUser) {
      return existingUser; // Return existing user if found
    }
    const newUser = new User({ chat_id, username });
    await newUser.save();
    return newUser; // Return the newly created user
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw new Error("User creation failed");
  }
};

// Function to get a user with chat_id
export const getUser = async (userData) => {
  try {
    const user = await User.findOne(userData);
    if (user) {
      return user;
    }
    return false;
  } catch (error) {
    console.error("Error getting user:", error.message);
    throw new Error("User fetching failed");
  }
};

// Function to update name
export const updateName = async (chat_id, newName) => {
  try {
    const result = await User.findOneAndUpdate(
      { chat_id },
      { name: newName },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Error updating user name:", error.message);
    throw new Error("Name update failed");
  }
};

// Function to update gender
export const updateGender = async (chat_id, newGender) => {
  try {
    const result = await User.findOneAndUpdate(
      { chat_id },
      { gender: newGender },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Error updating user gender:", error.message);
    throw new Error("Gender update failed");
  }
};

// Function to update name
export const updateUsername = async (chat_id, username) => {
  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return false; // Return false if username exist
    }
    const result = await User.findOneAndUpdate(
      { chat_id },
      { username },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Error updating user name:", error.message);
    throw new Error("Name update failed");
  }
};
