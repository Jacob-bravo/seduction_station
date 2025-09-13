import React, { useContext } from "react";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../firebase";
import { storage } from "../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  updateMetadata,
} from "firebase/storage";
import { toast } from "react-toastify";

const PAYPAL_CLIENT_ID =
  "Afz7vsz_mNK3biEdSDO2RGHz0DpqFvCJzqRavxpVqBuS71XYH93uziNQyuWIBtF0GLn0";
const PAYPAL_SECRET_KEY =
  "EBx4YJH-c548WOfsd55zF-D7g34i2zx1hAV9y3jLgLUXpNze6Bd8CXpbANCRKBZQxPmIsaroj0I-L3cE";
const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";

export const CreateAccount = async (username, email, password, socket) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredentials;

    if (!user || !user.uid) {
      throw new Error("Firebase user creation failed.");
    }

    const userUid = user.uid;
    const data = { username, email, userUid };

    const response = await axios.post(
      "/api/v1/user/create-new-account/login",
      data
    );

    if (response.status === 201) {
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      socket.emit("userConnected", response.data.user._id);

      return {
        user: response.data.user,
        status: response.status,
        statusText: response.statusText,
      };
    }

    // rollback Firebase account if MongoDB write fails
    await user.delete();
  } catch (error) {
    let errorMessage = "Something went wrong during account creation.";
    let statusCode = 500;

    if (error.code) {
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "This email is already registered. Try logging in instead.";
          statusCode = 409;
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is not valid.";
          statusCode = 400;
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters.";
          statusCode = 400;
          break;
        default:
          errorMessage = error.message || "An unknown Firebase error occurred.";
          statusCode = 500;
          break;
      }
    } else if (error.response) {
      // backend error handling
      errorMessage =
        error.response.data?.message ||
        error.response.statusText ||
        "Backend error.";
      statusCode = error.response.status;
    }

    return {
      user: null,
      status: statusCode,
      statusText: errorMessage,
    };
  }
};

export const LoginTOAccount = async (email, password) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredentials;

    if (!user || !user.uid) {
      throw new Error("Login failed. Try again later.");
    }
  } catch (error) {
    let errorMessage = "Something went wrong. Please try again.";
    let statusCode = 500;
    if (error.code) {
      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          statusCode = 401;
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          statusCode = 404;
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is not valid.";
          statusCode = 400;
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed login attempts. Try again later.";
          statusCode = 429;
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password. Please try again.";
          statusCode = 401;
          break;
        default:
          errorMessage = error.message || "An unknown error occurred.";
          statusCode = 500;
          break;
      }
    } else if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.statusText ||
        "Backend error.";
      statusCode = error.response.status;
    }
    return {
      user: null,
      status: statusCode,
      statusText: errorMessage,
    };
  }
};

export const SendPasswordResetEmail = async (email) => {
  try {
    const success = await sendPasswordResetEmail(auth, email);
    toast("Check your Inbox/Spam for a password reset");
    return success;
  } catch (error) {
    console.log(error.code, error.message);
    return error;
  }
};
export const Logout = async () => {
  try {
    await auth.signOut();
    localStorage.removeItem("userData");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const FetchModels = async () => {
  try {
    try {
      let link = `/api/v1/models`;
      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  } catch (error) {}
};
export const FetchModel = async (id) => {
  try {
    const response = await axios.get(`/api/v1/models/${id}`);
    if (response.status === 200) {
      return {
        model: response.data.model,
        status: response.status,
        statusText: response.statusText,
      };
    }
  } catch (error) {
    return {
      user: null,
      status: error?.response?.status || 500,
      statusText: error.response?.data?.message || "Something went wrong",
    };
  }
};
export const getInfiniteModelResults = async (pageParam, keyword) => {
  pageParam = pageParam || 1;
  try {
    let link = `/api/v1/models?page=${pageParam}`;
    if (keyword !== "") {
      link += `&keyword=${keyword}`;
    }
    const { data } = await axios.get(link);
    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const newConversation = async (receiver) => {
  try {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) {
      throw new Error("User not logged in");
    }
    const user = JSON.parse(storedUser);
    const conversationUuid = uuidv4();
    const chatMembers = [
      {
        userId: user._id,
        name: user.username,
        profile: user.profileimage || "",
      },
      {
        userId: receiver.userId,
        name: receiver.name,
        profile: receiver.profile || "",
      },
    ];
    const data = {
      conversationUuid,
      chatMembers,
      senderId: user._id,
    };
    const response = await axios.post(
      "/api/v1/converstions/create-newConversation",
      data
    );
    return {
      conversation: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    return {
      conversation: null,
      status: error?.response?.status || 500,
      statusText:
        error?.response?.data?.message || "Failed to create conversation",
    };
  }
};
export const FetchConversations = async () => {
  try {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) {
      throw new Error("User not logged in");
    }
    const user = JSON.parse(storedUser);
    let link = `/api/v1/converstions/${user._id}`;
    const { data } = await axios.get(link);
    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
const generateVideoThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.currentTime = 1; // seek to 1s mark for thumbnail

    video.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject("Failed to create thumbnail blob");
          }
        },
        "image/jpeg",
        0.7
      );
    });

    video.addEventListener("error", () => {
      reject("Failed to load video for thumbnail");
    });
  });
};

export const SendMessage = async (
  conversationUuid,
  message,
  uploadFirebaseFile,
  onProgress
) => {
  try {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) throw new Error("User not logged in");

    const user = JSON.parse(storedUser);
    const messageId = uuidv4();
    let fileUrl = null;
    let thumbnailUrl = null;
    let messageType = "text";

    if (uploadFirebaseFile) {
      const file = uploadFirebaseFile;
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      const filename = `${messageId}.${fileExtension}`;
      const storagePath = `userProfiles/${user.Uid}/messages/${filename}`;
      const fileRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(fileRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
          },
          (error) => reject(error),
          async () => {
            fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          }
        );
      });

      if (isVideo) {
        messageType = "video";
        const thumbnailBlob = await generateVideoThumbnail(file);
        const thumbRef = ref(
          storage,
          `userProfiles/${user.Uid}/messages/thumbnails/${messageId}.jpg`
        );

        const thumbTask = uploadBytesResumable(thumbRef, thumbnailBlob);

        await new Promise((resolve, reject) => {
          thumbTask.on(
            "state_changed",
            null, // skip progress for thumbnail
            (error) => reject(error),
            async () => {
              thumbnailUrl = await getDownloadURL(thumbTask.snapshot.ref);
              resolve();
            }
          );
        });
      } else if (isImage) {
        messageType = "photo";
      }
    }

    const newMessage = {
      conversationId: conversationUuid,
      senderId: user._id,
      type: messageType,
      text: message,
      fileText: fileUrl,
      thumbnail: thumbnailUrl,
      messageId,
    };

    const response = await axios.post(
      "/api/v1/converstions/existing-conversation-newMessage",
      {
        conversationUuid,
        newMessage,
      }
    );

    if (response.status === 201) {
      return {
        sentMessage: response.data.newMessage,
        status: response.status,
        statusText: response.statusText,
      };
    }
  } catch (error) {
    return {
      sentMessage: null,
      status: error?.response?.status || 500,
      statusText: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const FetchMessages = async (conversationUuid) => {
  try {
    let link = `/api/v1/converstion/messages/${conversationUuid}`;
    const response = await axios.get(link);
    return {
      Messages: response.data.Messages,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    console.log(error);
    return {
      conversation: null,
      status: error?.response?.status || 500,
      statusText:
        error?.response?.data?.message || "Failed to create conversation",
    };
  }
};
const getLoggedInUser = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};
export const updateUser = async (image, username, about) => {
  try {
    const user = getLoggedInUser();
    if (!user) throw new Error("User not logged in.");

    const uid = user.Uid;
    let imageUrl = user.profileimage;

    // keep original values if username/about are empty
    const finalUsername =
      username && username.trim() !== "" ? username : user.username;
    const finalAbout = about && about.trim() !== "" ? about : user.about;

    // handle image upload
    if (image) {
      const storageRef = ref(storage, `userProfiles/${uid}/profile.jpg`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    const requestBody = {
      uid,
      profileimage: imageUrl,
      username: finalUsername,
      about: finalAbout,
    };

    const response = await axios.post(`/api/v1/user/upload`, requestBody);

    if (response.status === 200) {
      const updatedUser = response.data.user;
      localStorage.setItem("userData", JSON.stringify(updatedUser));
    }

    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const uploadMediaToFirebase = (file, uid, isVideo, onProgress) => {
  return new Promise((resolve, reject) => {
    const folder = isVideo === false ? "videos" : "photos";
    const fileName = `${Date.now()}_${file.name}`;
    const storagePath = `userProfiles/${uid}/${folder}/${fileName}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress.toFixed(0));
        // console.log(`Upload is ${progress.toFixed(2)}% done`);
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const mediaData = {
            uid,
            isPhotos: isVideo === false ? false : true,
            Photos: {
              hostId: uuidv4(),
              url: downloadURL,
            },
            Videos: {
              hostId: uuidv4(),
              url: downloadURL,
            },
          };

          const response = await axios.post(
            "/api/v1/user/upload/media",
            mediaData
          );

          if (response.status === 200) {
            resolve({
              downloadURL,
              user: response.data.user,
              status: response.status,
              statusText: response.statusText,
            });
          } else {
            reject(new Error(`Unexpected response: ${response.statusText}`));
          }
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};
export const initiatePayment = async (OrderPrice, ModelId) => {
  try {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) {
      throw new Error("User not logged in");
    }
    const user = JSON.parse(storedUser);
    const myId = user._id;
    const data = { OrderPrice, ModelId, myId };
    const response = await axios.post("/api/v1/payment", data);

    if (response.status === 201) {
      return {
        approvalUrl: response.data.approvalUrl,
        status: response.status,
        statusText: response.statusText,
      };
    }
  } catch (error) {}
};
export const CheckPaidStatus = async (modelId) => {
  try {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) {
      throw new Error("User not logged in");
    }
    const user = JSON.parse(storedUser);
    const myId = user._id;
    const data = { myId, modelId };
    const response = await axios.post("/api/v1/models/paid-status", data);
    if (response.status === 200) {
      return {
        hasPaid: response.data.hasPaid,
        status: response.status,
        statusText: response.statusText,
      };
    }
  } catch (error) {}
};
export const generateAccessToken = async () => {
  try {
    const base64Credentials = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`);

    const res = await axios.post(
      `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64Credentials}`,
        },
      }
    );

    return res.data.access_token;
  } catch (err) {
    console.error(
      "Error generating access token:",
      err?.response?.data || err.message
    );
    throw err;
  }
};

export const captureOrder = async (orderId, accessToken, modelId, myId) => {
  try {
    const res = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (res.data.status === "COMPLETED") {
      completeOrder(modelId, myId);
    } else {
      console.warn("Order not completed. Status:", res.data.status);
    }

    return res.data;
  } catch (err) {
    console.error("Error capturing order:", err?.response?.data || err.message);
    throw err;
  }
};
const completeOrder = async (modelId, myId) => {
  try {
    const data = { modelId, myId };
    const response = await axios.post("/api/v1/complete-order", data);
    if (response.status === 200) {
      return {
        status: response.status,
        statusText: response.statusText,
      };
    }
  } catch (error) {}
};
