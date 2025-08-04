const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  conversationUuid: {
    type: String,
  },
  members: [
    {
      userId: {
        type: String,
      },
      name: {
        type: String,
      },
      profile: {
        type: String,
      }
    },
  ],
  lastmessage: {
    type: String,
    default: "",
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Conversation", ConversationSchema);