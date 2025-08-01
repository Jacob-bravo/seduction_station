const User = require("../models/UserModel");
const Model = require("../models/Models");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const bcrypt = require('bcrypt');






exports.createNewUserAccount = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      username,
      profileimage,
      email,
      password,
    } = req.body;

    const existingUser = await User.findOne({ email: email })

    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        username,
        profileimage,
        email,
        password: hashedPassword
      });

      const user = await newUser.save();
      if (user._id) {
        return res.status(201).json({
          user,
          success: true,
          message: "Account Created Successfully",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "This email already exists. Please login or request a password reset"
      })
    }


  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

exports.LoginExistingUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    const user = await User.findOne({ email: email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (email not found)",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (password mismatch)",
      });
    }
    return res.status(200).json({
      user,
      success: true,
      message: "Login successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
})

exports.createNewModel = catchAsyncErrors(async (req, res, next) => {
  try {
    const { username, about, profileimage, Photos, Videos } = req.body;
    const newModel = new Model({
      username,
      about,
      profileimage,
      Photos,
      Videos
    })
    const savedModel = await newModel.save();
    if (savedModel._id) {
      return res.status(201).json({
        success: true,
        message: "Model Added Success",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
})

exports.getAllModels = catchAsyncErrors(async (req, res, next) => {
  try {
    const resPerPage = 30;
    const modelsCount = await Model.countDocuments();
    const totalPages = Math.ceil(modelsCount / resPerPage);
    const apiFeatures = new APIFeatures(Model.find(), req.query)
      .searchModel()
      .pagination(resPerPage);
    let Models = await apiFeatures.query;
    return res.status(200).json({
      count: Models.length,
      totalPages,
      Models,
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

exports.getModelById = catchAsyncErrors(async (req, res, next) => {
  try {
    const model = await Model.findById(req.params.id);
    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not Found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Model Found",
      model
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
})
