import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    chat_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
