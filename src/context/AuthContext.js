import React, { createContext, useState } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // default: not logged in
  
  //Write login logic
  const login = () => {
    //make a post request to login
    if(!isLoggedIn){
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
