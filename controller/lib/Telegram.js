import { getAxiosInstance } from "./axios.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const axiosInstance = getAxiosInstance();
const sendMessage = (messageObj, messageText) => {
  return axiosInstance.get("sendMessage", {
    chat_id: messageObj.chat.id,
    text: messageText,
  });
};

export const handleMessage = async (messageObj) => {
  const messageText = messageObj.text || "";

  if (messageText.charAt(0) === "/") {
    const command = messageText.substr(1);
    switch (command) {
      case "start":
        return sendMessage(
          messageObj,
          "Hi! I'm a bot. I can help you to get started"
        );
      default:
        return sendMessage(messageObj, "Hey hi, i don't know that command");
    }
  } else {
    const result = await model.generateContent(messageText);
    const text = result || "Sorry, I can't answer that!";
    return sendMessage(messageObj, text);
  }
};