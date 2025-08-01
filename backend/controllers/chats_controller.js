const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/UserModel");
const Model = require("../models/Models")



exports.createConversation = catchAsyncErrors(async (req, res, next) => {
  try {
    const { chatMembers, conversationUuid, senderId } = req.body;
    const existingConversation = await Conversation.findOne({
      "members.userId": { $all: chatMembers.map((member) => member.userId) },
    });

    if (existingConversation) {
      await existingConversation.save();
      return res.status(404).json({
        conversation: conversationUuid,
        message: "Conversation with the same members already exists",
      });
    } else {

      const newConversation = new Conversation({
        conversationUuid: conversationUuid,
        members: chatMembers,
        senderId: req.body.senderId || "",
        senderName: req.body.senderName || "",
        lastmessage: req.body.lastmessage || "",
        isSent: true,
        messageCount: 0,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
      });

      await newConversation.save();

    }

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

exports.postnewMessage = catchAsyncErrors(async (req, res, next) => {
  try {
    const { newMessage, conversationUuid } = req.body;
    let conversation = await Conversation.findOne({
      conversationUuid: conversationUuid,
    });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation Doesnt Exist",
      });
    } else {

      let lastmessage;

      if (newMessage.type === "image") {
        lastmessage = "📷 Photo";
      } else if (newMessage.type === "video") {
        lastmessage = "🎥 video";
      } else {
        lastmessage = newMessage.text;
      }
      await Conversation.findOneAndUpdate(
        { conversationUuid: conversationUuid },
        {
          lastmessage: lastmessage,
          senderId: newMessage.senderId,
          senderName: newMessage.senderName,
          updatedAt: Date.now(),
          deleteRequests: [],
        },
        { new: true }
      );
      newMessage.isSent = true;
      await Message.create(newMessage);
      res.status(201).json({
        success: true,
        message: "Message Created Successfully"
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

exports.deleteMessage = catchAsyncErrors(async (req, res, next) => {
  try {
    const { messageId } = req.body;
    const messageToDelete = await Message.findOneAndDelete({ messageId: messageId })
    if (!messageToDelete) {
      return res.status(400).json({
        success: false,
        message: "Message not Found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Message deleted Successfully"
    })
  } catch (error) {

  }

})

exports.getAllConversations = catchAsyncErrors(async (req, res, next) => {
  try {
    const resPerPage = 30;
    const ConversationCount = await Conversation.countDocuments();
    const totalPages = Math.ceil(ConversationCount / resPerPage);
    const apiFeatures = new APIFeatures(Conversation.find({ senderId: req.params.userId }), req.query)
      .search()
      .pagination(resPerPage);
    let Conversations = await apiFeatures.query;
    return res.status(200).json({
      count: Conversations.length,
      totalPages,
      Conversations,
      message: "Request Success"
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
})

