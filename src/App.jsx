import React, { lazy, useContext } from "react";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "@/components/AccessibleNavigationAnnouncer";
import PrivateRoute from "@/components/login/PrivateRoute";
import "./_.css";
import "./dropdown.css";
import { useEffect } from "react";
import { AdminContext } from "./context/AdminContext";
const Layout = lazy(() => import("@/layout/Layout"));
const Login = lazy(() => import("@/pages/Login"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const ForgetPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));

const App = () => {
  const { setDimentions } = useContext(AdminContext);
  const documentDimensions = () => {
    const docWidth = window.innerWidth;
    const docHeight = window.innerHeight;
    setDimentions({
      height: docHeight,
      width: docWidth,
    });
    document.documentElement.style.setProperty("--doc-width", `${docWidth}px`);
    document.documentElement.style.setProperty(
      "--doc-height",
      `${docHeight}px`,
    );
  };

  useEffect(() => {
    window.addEventListener("resize", documentDimensions);

    documentDimensions();

    return () => {
      window.removeEventListener("resize", documentDimensions);
    };
  }, []);
  return (
    <>
      <ToastContainer />
      <Router>
        <AccessibleNavigationAnnouncer />

        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/forgot-password" component={ForgetPassword} />
          <Route path="/reset-password/:token" component={ResetPassword} />
          <Redirect exact from="/" to="/login" />
          <PrivateRoute path="/">
            <Route path="/" component={Layout} />
          </PrivateRoute>
        </Switch>
      </Router>
    </>
  );
};

export default App;
