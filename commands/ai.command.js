import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendMessage } from "./general.command.js";
import dotenv from "dotenv";
import { getUser } from "../controllers/user.controller.js";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to send a letter to other user
export const AI_SendToCommand = async (chat_id, receiver_id, message) => {
  try {
    const sender = await getUser(chat_id);
    const receiver = await getUser(receiver_id);
    if (sender && receiver) {
      const prompt = `Imagine yourself as a warm-hearted, friendly messenger. Deliver an uplifting message 
      ${receiver.name ? `to ${receiver.name}` : ""} on behalf of ${
        sender.name ? sender.name : "someone"
      }${
        sender.gender ? " a " + sender.gender  + " person": ""
      }. The message to convey is: "${message}". Make sure the tone is bright, positive, and filled with encouragement, leaving the recipient feeling joyful and appreciated. Avoid including any signature part.`;

      // Generate a response using the Google AI model
      const result = await model.generateContent(prompt);
      const text = result?.response?.text();

      sendMessage(
        sender.chat_id,
        `Successfully sent to ${
          receiver.name ? receiver.name : "someone"
        }: \n\n${text}`
      ); // send to sender
      return sendMessage(receiver.chat_id, text); // send to receiver
    } else {
      return sendMessage(chat_id, errorMessages[101]);
    }
  } catch (error) {
    // Fallback message in case of API error or safety block
    let fallbackMessage = `Sorry, it seems I cannot process that message right now. Please try again later!`;

    if (error?.response?.candidates?.[0]?.safetyRatings) {
      // Check if the error is related to safety concerns and adjust the message
      fallbackMessage = `Hey, your message seems a bit sensitive. Let's try saying it differently!`;
    }
    console.error("Error in AI_SendToCommand:", error.message);
    return sendMessage(senderId, fallbackMessage); // send to sender
  }
};

export const AI_TalkCommand = async (chat_id, prompt) => {
  try {
    // Handle regular messages by generating a response using the Google AI model
    const result = await model.generateContent(prompt);
    const responseText = result?.response?.text();
    return sendMessage(chat_id, responseText);
  } catch (error) {
    console.error("Error in AI_TalkCommand:", error.message);
    return sendMessage(chat_id, errorMessages[101]);
  }
};

// TODO: Add database : done
// TODO: Add commands set nickname, gender : done
// TODO: enhance the write letter prompt : done
// TODO: separate commands with ai : done
