import axios from "axios";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Construct the base URL for Telegram API using the bot token
const BASE_URL = `https://api.telegram.org/bot${process.env.MY_TOKEN}`;

// Create an Axios instance configured with the base URL
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Function to send requests to the Telegram API
export const sendRequest = (method, data) => {
  return axiosInstance[method](method === "get" ? `/${data.method}` : `/${data.method}`, data.params || data);
};
