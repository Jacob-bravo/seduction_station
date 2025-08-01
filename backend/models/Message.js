const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
  },
  senderId: {
    type: String,
  },
  senderName: {
    type: String,
  },
  type: {
    type: String,
  },
  text: {
    type: String,
  },
  fileText: {
    type: String,
  },
  receiverFileText: {
    type: String,
  },
  caption: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  duration: {
    type: String,
  },
  messageId: {
    type: String,
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  repliedMessage: {
    type: String,
  },
  repliedTo: {
    type: String,
  },
  repliedMessageType: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
});

module.exports = mongoose.model("Message", MessageSchema);