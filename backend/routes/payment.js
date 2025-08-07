const express = require("express");
const router = express.Router();

const { createOrder, completeOrder } = require("../controllers/paypal");


router.route("/payment").post(createOrder);
router.route("/complete-order").post(completeOrder);


module.exports = router;
