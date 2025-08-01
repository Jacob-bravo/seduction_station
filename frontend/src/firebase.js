import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChZq8ukUifg_J95L83ixHOqi_s3ZLBV6o",
  authDomain: "seductionstation-dd680.firebaseapp.com",
  projectId: "seductionstation-dd680",
  storageBucket: "seductionstation-dd680.firebasestorage.app",
  messagingSenderId: "633290152668",
  appId: "1:633290152668:web:b78d05f1afa7f34d67f219",
  measurementId: "G-HYGDQ6E7LW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);