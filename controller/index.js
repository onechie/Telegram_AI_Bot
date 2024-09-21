// import { handleMessage } from "./lib/Telegram.js";

// export const handler = async (req, method) => {
//   const { body } = req;
//   if (body) {
//     const messageObj = body.message;
//     await handleMessage(messageObj);
//   }
//   return;
// };

import { handleMessage } from "./lib/Telegram.js";

export const handler = async (req) => {
  const messageObj = req.body?.message;
  if (messageObj) {
    await handleMessage(messageObj);
  }
};
