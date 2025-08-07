const express = require("express");
const router = express.Router();

const {
  createNewUserAccount,
  LoginExistingUser,
  createNewModel,
  getAllModels,
  getModelById,
  getUserUid,
  UploadMedia,
  AddUserMedia, hasPaid

} = require("../controllers/user_controller");

router.route("/user/create-new-account/login").post(createNewUserAccount);
router.route("/user/uid/:uid").get(getUserUid);
router.route("/user/account/login").post(LoginExistingUser);
router.route("/model/new-model").post(createNewModel);
router.route("/models").get(getAllModels);
router.route("/models/paid-status").post(hasPaid);
router.route("/models/:id").get(getModelById);
router.route("/user/upload").post(UploadMedia);
router.route("/user/upload/media").post(AddUserMedia);

module.exports = router;