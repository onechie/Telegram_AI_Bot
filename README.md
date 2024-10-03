# Telegram AI Bot

This AI-powered Telegram bot, built with **Node.js**, **Express**, and **MongoDB**, is designed to interact with users and handle a variety of commands. It also serves as a question buddy, allowing users to ask various questions and receive intelligent responses. Powered by the Google AI Gemini API, the bot provides a flexible chatbot experience with a simple command-based interface.

## Technologies Used

- **Node.js**
- **Express**
- **MongoDB**
- **Google AI Gemini API**

## Quick Guide to Commands

### Available Commands

- **`/start`**  
  Initializes the bot and sends a welcome message to the user.
  
- **`/get_me`**  
  Retrieves the user's current profile information.

- **`/set_name [name]`**  
  Sets the user's display name. Allows multi-word names.  
  Example: `/set_name John Doe`
  
- **`/set_gender [gender]`**  
  Sets the user's gender.  
  Example: `/set_gender male`
  
- **`/set_username [username]`**  
  Sets the user's preferred username.  
  Example: `/set_username john000`
  
- **`/send_to [user] [message]`**  
  Sends a message to another user.  
  Example: `/send_to john_doe Hello, how are you?`
  
- **`/help`**  
  Displays the list of available commands and their descriptions.

### Default Behavior

If no command is detected (message does not start with `/`), the bot acts as a question buddy. You can ask it various questions, and it will respond intelligently.
