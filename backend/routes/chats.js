const express = require("express");
const router = express.Router();

const {createConversation,postnewMessage,getAllConversations} = require("../controllers/chats_controller");

router.route("/converstions/create-newConversation").post(createConversation);
router.route("/converstions/existing-conversation-newMessage").post(postnewMessage);
router.route("/converstions/:userId").get(getAllConversations);


module.exports = router;