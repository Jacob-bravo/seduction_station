import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser({
          id: authUser.uid,
          email: authUser.email,
        });
        try {
          const userDataString = localStorage.getItem('userData');
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            setUser(userData);
        
          } else {
            const response = await fetch(`https://synchronia.onrender.com/api/v1/login/user/details/${authUser.uid}`);
            if (response.ok) {
              const userData = await response.json();
              localStorage.setItem('userData', JSON.stringify(userData));
              setUser(userData);
            } else {
              console.error('Failed to fetch user data');
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }


      } else {
        setUser(null);
        // Clear localStorage when user is logged out
        localStorage.removeItem('userData');

        // Disconnect socket if user logs out
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