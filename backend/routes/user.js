const express = require("express");
const router = express.Router();

const {
  createNewUserAccount,
  LoginExistingUser,
  createNewModel,
  getAllModels,
  getModelById
} = require("../controllers/user_controller");

router.route("/user/create-new-account/login").post(createNewUserAccount);
router.route("/user/account/login").post(LoginExistingUser);
router.route("/model/new-model").post(createNewModel);
router.route("/models").get(getAllModels);
router.route("/models/:id").get(getModelById);

module.exports = router;