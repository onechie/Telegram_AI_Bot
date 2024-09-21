import { handleMessage } from "./lib/Telegram.js";

export const handler = async (req, method) => {
  const { body } = req;
  if (body) {
    const messageObj = body.message;
    await handleMessage(messageObj);
  }
  return;
};