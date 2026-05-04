import { model, Schema } from "mongoose";

const messageSchema = new Schema({
  senderName: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  receiverId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'unseen'
  }

}, { timestamps: true })

const Message = model("message", messageSchema);
export default Message;