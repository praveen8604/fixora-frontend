import Cookies from "js-cookie";
import React, { createContext, useReducer, useState } from "react";

export const AdminContext = createContext();

const DEV_ADMIN = {
  _id: "local-dev-admin",
  userName: "Dev Admin",
  email: "dev@local.com",
  phoneNumber: "0000000000",
  countryCode: "+91",
  role: "Admin",
};

const readAdminFromCookie = () => {
  const raw = Cookies.get("adminInfo");
  if (raw && raw !== "undefined") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
};

const getAdminInfo = () =>
  readAdminFromCookie() || (import.meta.env.DEV ? DEV_ADMIN : null);

const initialState = {
  adminInfo: getAdminInfo(),
  dimentions: {
    height: 0,
    width: 0,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, adminInfo: action.payload };

    case "USER_LOGOUT":
      return {
        ...state,
        adminInfo: import.meta.env.DEV ? DEV_ADMIN : null,
      };

    default:
      return state;
  }
}

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [dimentions, setDimentions] = useState(initialState.dimentions);
  const value = { state, dispatch, dimentions, setDimentions };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
