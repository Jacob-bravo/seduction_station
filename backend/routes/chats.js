const express = require("express");
const router = express.Router();

const { createConversation, postnewMessage, getAllConversations, fetchAllMessages } = require("../controllers/chats_controller");

router.route("/converstions/create-newConversation").post(createConversation);
router.route("/converstions/existing-conversation-newMessage").post(postnewMessage);
router.route("/converstions/:userId").get(getAllConversations);
router.route("/converstion/messages/:id").get(fetchAllMessages);


module.exports = router;