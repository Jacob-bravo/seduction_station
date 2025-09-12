import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { io } from "socket.io-client";

export const AuthContext = createContext();
const SocketContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const fetchUserWithRetry = async (userId, retries = 5, delay = 500) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(`/api/v1/user/uid/${userId}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.error(`Fetch attempt ${i + 1} failed:`, err);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    throw new Error("User not found after retries");
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const newSocket = io("https://seduction-station.onrender.com");
        setSocket(newSocket);
        const userId = authUser.uid;
        let userData = null;
        const userDataString = localStorage.getItem("userData");
        if (userDataString) {
          userData = JSON.parse(userDataString);
        } else {
          try {
            userData = await fetchUserWithRetry(userId);
            if (userData) {
              localStorage.setItem("userData", JSON.stringify(userData.user));
            } else {
              console.error("Failed to fetch user data");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }

        if (userData) {
          setUser(userData);
          newSocket.on("connect", () => {
            newSocket.emit("userConnected", userData._id);
          });
        }
      } else {
        setUser(null);
        localStorage.removeItem("userData");
        if (socket) {
          socket.disconnect();
          setSocket(null);
        }
      }

      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, []);

  const value = {
    user,
    isLoading,
    socket,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
