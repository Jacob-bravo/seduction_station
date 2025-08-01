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
    default: ""
  },
  receiverFileText: {
    type: String,
  },
  caption: {
    type: String,
    default: ""
  },
  thumbnail: {
    type: String,
    default: ""
  },
  duration: {
    type: String,
    default: ""
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
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", MessageSchema);