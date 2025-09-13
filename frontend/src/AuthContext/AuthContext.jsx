import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      try {
        if (authUser) {
          const response = await fetch(`/api/v1/user/uid/${authUser.uid}`);
          if (!response.ok) throw new Error("MongoDB user not found");

          const userDataObject = await response.json();
          const userData = userDataObject.user;

          if (userData) {
            localStorage.setItem("userData", JSON.stringify(userData));

            const newSocket = io("https://secretseduction.org");
            setSocket(newSocket);

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
      } catch (err) {
        console.error("AuthProvider error:", err);
        setUser(null);
        localStorage.removeItem("userData");
      } finally {
        setIsLoading(false);
      }
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
