const User = require("../models/UserModel");
const Model = require("../models/Models");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const bcrypt = require('bcrypt');
const UserModel = require("../models/UserModel");



// Hashing passwords
// exports.createNewUserAccount = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const {
//       username,
//       profileimage,
//       email,
//       password,
//       userUid,
//     } = req.body;

//     const existingUser = await User.findOne({ email: email })

//     if (!existingUser) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
//       const newUser = new User({
//         Uid: userUid,
//         username,
//         profileimage,
//         email,
//         password: hashedPassword
//       });

//       const user = await newUser.save();
//       if (user._id) {
//         return res.status(201).json({
//           user,
//           success: true,
//           message: "Account Created Successfully",
//         });
//       }
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "This email already exists. Please login or request a password reset"
//       })
//     }


//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// });
exports.createNewUserAccount = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      username,
      profileimage,
      email,
      userUid,
    } = req.body;

    const existingUser = await User.findOne({ email: email })

    if (!existingUser) {
      const newUser = new User({
        Uid: userUid,
        username,
        profileimage,
        email,
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
      uid
    } = req.body;

    const user = await User.findOne({ email: email, Uid: uid }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (email not found)",
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
    const modelsCount = await UserModel.countDocuments();
    const totalPages = Math.ceil(modelsCount / resPerPage);
    const apiFeatures = new APIFeatures(UserModel.find({ isModel: true }), req.query)
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
    const model = await UserModel.findById(req.params.id);
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
exports.getUserUid = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ Uid: req.params.uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Model not Found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Model Found",
      user
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
})

exports.UploadMedia = catchAsyncErrors(async (req, res, next) => {
  try {
    const { uid, profileimage, username, about } = req.body;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "UID is required",
      });
    }

    // Prepare the update object dynamically
    const updateData = {};
    if (profileimage !== undefined) updateData.profileimage = profileimage;
    if (username !== undefined) updateData.username = username;
    if (about !== undefined) updateData.about = about;

    const user = await UserModel.findOneAndUpdate(
      { Uid: uid },
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

exports.AddUserMedia = catchAsyncErrors(async (req, res, next) => {
  try {
    const { uid, isPhotos, Photos, Videos } = req.body;
    const user = await User.findOne({ Uid: uid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (isPhotos) {
      if (Photos) {
        user.Photos.push(Photos);
      }
    } else {
      if (Videos) {
        user.Videos.push(Videos);
      }
    }
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Media added successfully",
      user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
exports.hasPaid = catchAsyncErrors(async (req, res, next) => {
  try {
    const { myId, modelId } = req.body;
    const user = await User.findById(myId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const hasPaid = user.cart.includes(modelId);
    return res.status(200).json({
      success: true,
      message: "Status checked success",
      hasPaid,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
