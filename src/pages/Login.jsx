import React, { useContext, useEffect, useState } from "react";

import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt, FaArrowRight } from "react-icons/fa";
import { FiShield, FiLock, FiCheckCircle } from "react-icons/fi";

import { Button } from "@windmill/react-ui";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "@/utils/toast";
import Error from "@/components/form/others/Error";

import logo from "@/assets/img/logo/logo.png";

import { AdminContext } from "@/context/AdminContext";
import { removeSetting } from "@/reduxStore/slice/settingSlice";
import AdminServices from "@/services/AdminServices";

import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { DecryptData } from "@/utils/DecryptData";

const Login = () => {
  const reduxDispatch = useDispatch();
  const { dispatch } = useContext(AdminContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const cookieTimeOut = 0.5;

  const [loginMethod, setLoginMethod] = useState("otp");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredMobileNumber, setEnteredMobileNumber] = useState("");
  const [enteredCountryCode, setEnteredCountryCode] = useState("");

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [userCountry, setUserCountry] = useState("in");

  const maskedNumber = enteredMobileNumber?.replace(
    /\d(?=\d{4})/g,
    "*",
  );

  const maskedEmail = enteredEmail?.replace(
    /^(.)(.*)(@.*)$/,
    (match, firstChar, middleChars, domain) =>
      firstChar + middleChars.replace(/./g, "*") + domain,
  );

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_code) {
          setUserCountry(data.country_code.toLowerCase());
        }
      })
      .catch(() => setUserCountry("in"));
  }, []);

  const handlePhoneChange = (value, country) => {
    const dialCode = country?.dialCode || "";

    const nationalNumber = value.startsWith(dialCode)
      ? value.slice(dialCode.length)
      : value;

    const formattedCountryCode = dialCode
      ? `+${dialCode}`
      : "";

    setValue("countryCode", formattedCountryCode);
    setValue("phoneNumber", nationalNumber);

    setEnteredMobileNumber(nationalNumber);
    setEnteredCountryCode(formattedCountryCode);
  };

  const goToDashboard = (data = {}) => {
    const user = data?.user || {};

    const adminPayload = {
      _id: user._id || "local-admin",
      userName: user.userName || "Admin",
      email:
        user.email ||
        enteredEmail ||
        "admin@fixmantra.com",
      phoneNumber:
        user.phoneNumber ||
        enteredMobileNumber ||
        "",
      countryCode:
        user.countryCode ||
        enteredCountryCode ||
        "+91",
      role: user.role || "admin",
      createdAt:
        user.createdAt ||
        new Date().toISOString(),
    };

    const token = data?.jwt_token;

    console.log("========== LOGIN TOKEN ==========");
    console.log("JWT:", token);
    console.log("=================================");

    if (!token) {
      notifyError("Authentication token missing.");
      return;
    }

    dispatch({
      type: "USER_LOGIN",
      payload: adminPayload,
    });

    localStorage.setItem("theme", "light");

    Cookies.set(
      "adminInfo",
      JSON.stringify(adminPayload),
      {
        expires: cookieTimeOut,
      },
    );

    // IMPORTANT: JSON.stringify mat karo
    Cookies.set("token", token, {
      expires: cookieTimeOut,
    });

    console.log(
      "========== COOKIE AFTER LOGIN ==========",
    );
    console.log("JWT token:", token);
    console.log(
      "Saved cookie:",
      Cookies.get("token"),
    );
    console.log("All cookies:", Cookies.get());
    console.log(
      "========================================",
    );

    notifySuccess("Login Success!");

    window.location.replace("/dashboard");
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const payload =
        loginMethod === "otp"
          ? {
              phoneNumber: data.phoneNumber,
              countryCode: data.countryCode,
              isAuthServiceFor: "login",
            }
          : {
              email: data.email,
              isAuthServiceFor: "login",
            };

      console.log(
        "OTP REQUEST PAYLOAD:",
        payload,
      );

      console.log("OTP REQUEST START");

      const response =
        await AdminServices.loginOTPAdmin(payload);

      console.log(
        "OTP REQUEST RESPONSE:",
        response,
      );

      if (loginMethod === "otp") {
        setEnteredMobileNumber(data.phoneNumber);
        setEnteredCountryCode(data.countryCode);
      } else {
        setEnteredEmail(data.email);
      }

      notifySuccess("OTP sent successfully!");

      setIsOtpSent(true);
    } catch (error) {
      console.log("OTP SEND ERROR:", error);
      console.log(
        "OTP SEND ERROR RESPONSE:",
        error?.response?.data,
      );

      notifyError(
        error?.response?.data?.message ||
          "Failed to send OTP.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length < 4) {
      notifyError("Please enter a valid OTP.");
      return;
    }

    try {
      setIsLoading(true);

      const payload =
        loginMethod === "otp"
          ? {
              phoneNumber: enteredMobileNumber,
              countryCode: enteredCountryCode,
              secretCodeClient: otp,
              deviceId: "admin-panel",
              verificationMethod: "otp",
              isLoginFor: "admin-panel",
            }
          : {
              email: enteredEmail,
              secretCodeClient: otp,
              deviceId: "admin-panel",
              verificationMethod: "email",
              isLoginFor: "admin-panel",
            };

      console.log("LOGIN PAYLOAD:", payload);

      const res =
        await AdminServices.verifyOTP(payload);

      console.log(
        "========== RAW LOGIN RESPONSE ==========",
      );
      console.log(res);
      console.log(
        "=========================================",
      );

      const decryptedResponse = DecryptData(res);

      console.log(
        "========== DECRYPTED LOGIN RESPONSE ==========",
      );
      console.log(decryptedResponse);
      console.log(
        "==============================================",
      );

      if (!decryptedResponse?.success) {
        notifyError(
          decryptedResponse?.message ||
            "Login failed.",
        );
        return;
      }

      const loginData =
        decryptedResponse?.data;

      console.log(
        "========== LOGIN DATA ==========",
      );
      console.log(loginData);
      console.log(
        "================================",
      );

      const jwt = loginData?.jwt_token;

      console.log(
        "========== LOGIN TOKEN ==========",
      );
      console.log("JWT:", jwt);
      console.log(
        "=================================",
      );

      if (!jwt) {
        notifyError(
          "JWT token not received from server.",
        );
        return;
      }

      reduxDispatch(
        removeSetting("globalSetting"),
      );

      goToDashboard(loginData);
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      console.log(
        "LOGIN ERROR RESPONSE:",
        error?.response?.data,
      );

      notifyError(
        error?.response?.data?.message ||
          error?.message ||
          "Invalid OTP.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeLoginMethod = (method) => {
    setLoginMethod(method);
    setIsOtpSent(false);
    setOtp("");
    setIsLoading(false);
  };

  return (
    <>
      <style>
        {`
          /* =========================================================
             FIXMANTRA LOGIN
             Layout / Plugin Styling Only
             
             Theme colors are handled by Tailwind classes.
          ========================================================= */

          .fm-login {
            min-height: 100vh;
          }

          .fm-shell {
            width: 100%;
            max-width: 1120px;
            min-height: 650px;
            display: grid;
            grid-template-columns: 0.92fr 1.08fr;
            overflow: hidden;
            border-radius: 18px;
            box-shadow:
              0 18px 45px rgba(15, 23, 42, 0.07),
              0 3px 10px rgba(15, 23, 42, 0.03);
          }

          /* =========================================================
             LEFT BRAND PANEL
          ========================================================= */

          .fm-brand-panel {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 48px;
          }

          .fm-brand-panel::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
          }

          .fm-brand-logo {
            max-width: 190px;
            max-height: 58px;
            object-fit: contain;
            object-position: left center;
          }

          .fm-brand-kicker {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 55px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.14em;
          }

          .fm-brand-kicker span {
            width: 22px;
            height: 2px;
          }

          .fm-brand-title {
            margin-top: 14px;
            max-width: 390px;
            font-size: 34px;
            line-height: 1.18;
            font-weight: 700;
            letter-spacing: -0.035em;
          }

          .fm-brand-description {
            max-width: 385px;
            margin-top: 16px;
            font-size: 14px;
            line-height: 1.8;
          }

          /* =========================================================
             PRODUCT FEATURES
          ========================================================= */

          .fm-feature-list {
            display: grid;
            gap: 10px;
            margin-top: 36px;
            max-width: 390px;
          }

          .fm-feature {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            border-radius: 10px;
          }

          .fm-feature-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            flex-shrink: 0;
            border-radius: 8px;
          }

          .fm-feature-text {
            font-size: 12px;
            font-weight: 600;
          }

          .fm-brand-footer {
            font-size: 10px;
            line-height: 1.6;
          }

          /* =========================================================
             RIGHT LOGIN AREA
          ========================================================= */

          .fm-form-panel {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px 65px;
          }

          .fm-form-container {
            width: 100%;
            max-width: 390px;
          }

          .fm-form-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
          }

          .fm-console-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.04em;
          }

          .fm-status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 10px;
          }

          .fm-status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
          }

          .fm-heading h1 {
            font-size: 28px;
            line-height: 1.2;
            font-weight: 700;
            letter-spacing: -0.025em;
          }

          .fm-heading p {
            margin-top: 8px;
            font-size: 13px;
            line-height: 1.6;
          }

          /* =========================================================
             LOGIN METHOD
          ========================================================= */

          .fm-methods {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
            margin-top: 28px;
            padding: 4px;
            border-radius: 10px;
          }

          .fm-method {
            height: 42px;
            border: 1px solid transparent;
            border-radius: 7px;
            background: transparent;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition:
              background-color 0.2s ease,
              color 0.2s ease,
              border-color 0.2s ease;
          }

          /* =========================================================
             LABELS
          ========================================================= */

          .fm-label {
            display: block;
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: 600;
          }

          /* =========================================================
             PHONE INPUT
          ========================================================= */

          .fm-phone {
            position: relative;
            width: 100%;
            height: 48px;
            overflow: hidden;
            border-width: 1px;
            border-style: solid;
            border-radius: 9px;
            box-sizing: border-box;
          }

          .fm-phone .form-control {
            width: 100% !important;
            height: 46px !important;
            padding-left: 58px !important;
            padding-right: 12px !important;
            border: none !important;
            outline: none !important;
            background: transparent !important;
            font-size: 14px !important;
            box-sizing: border-box !important;
          }

          .fm-phone .flag-dropdown {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 50px !important;
            height: 46px !important;
            border: none !important;
            border-right-width: 1px !important;
            border-right-style: solid !important;
            border-radius: 9px 0 0 9px !important;
            z-index: 2 !important;
          }

          .fm-phone .selected-flag {
            width: 50px !important;
            height: 46px !important;
            padding: 0 0 0 12px !important;
            border-radius: 9px 0 0 9px !important;
          }

          .fm-phone .selected-flag:hover {
            background: transparent !important;
          }

          .fm-phone .country-list {
            border-width: 1px !important;
            border-style: solid !important;
            border-radius: 9px !important;
            box-shadow:
              0 12px 25px rgba(16, 24, 40, 0.1) !important;
          }

          /* =========================================================
             EMAIL INPUT
          ========================================================= */

          .fm-email {
            display: flex;
            width: 100%;
            height: 48px;
            overflow: hidden;
            border-width: 1px;
            border-style: solid;
            border-radius: 9px;
            box-sizing: border-box;
          }

          .fm-email-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 46px;
            min-width: 46px;
            flex-shrink: 0;
            border-right-width: 1px;
            border-right-style: solid;
          }

          .fm-email input {
            width: 100%;
            min-width: 0;
            height: 46px;
            padding: 0 14px;
            border: 0;
            outline: none;
            background: transparent;
            font-size: 14px;
            box-sizing: border-box;
          }

          /* =========================================================
             SECURITY INFO
          ========================================================= */

          .fm-security {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 18px;
            padding: 11px 12px;
            border-width: 1px;
            border-style: solid;
            border-radius: 9px;
          }

          .fm-security-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            flex-shrink: 0;
            border-radius: 7px;
          }

          .fm-security-title {
            font-size: 11px;
            font-weight: 600;
          }

          .fm-security-text {
            margin-top: 2px;
            font-size: 10px;
          }

          /* =========================================================
             PRIMARY BUTTON
          ========================================================= */

          .fm-button {
            width: 100%;
            height: 48px;
            margin-top: 18px;
            border-radius: 9px !important;
            border: 0 !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            box-shadow: none !important;
            transition:
              background-color 0.2s ease,
              transform 0.15s ease;
          }

          .fm-button:hover {
            transform: translateY(-1px);
          }

          .fm-button:active {
            transform: translateY(0);
          }

          .fm-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          /* =========================================================
             SIGNUP
          ========================================================= */

          .fm-signup {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
          }

          .fm-signup a {
            font-weight: 600;
            transition: color 0.2s ease;
          }

          /* =========================================================
             OTP
          ========================================================= */

          .fm-otp-header {
            text-align: center;
          }

          .fm-otp-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 52px;
            height: 52px;
            margin: 0 auto 20px;
            border-width: 1px;
            border-style: solid;
            border-radius: 10px;
          }

          .fm-otp-header h2 {
            font-size: 22px;
            font-weight: 700;
          }

          .fm-otp-header p {
            max-width: 320px;
            margin: 8px auto 0;
            font-size: 13px;
            line-height: 1.6;
          }

          .fm-otp-label {
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: 600;
          }

          .fm-otp {
            width: 100%;
            height: 54px;
            border-width: 1px;
            border-style: solid;
            border-radius: 9px;
            outline: none;
            text-align: center;
            font-size: 21px;
            font-weight: 600;
            letter-spacing: 0.55em;
            padding-left: 0.55em;
            box-sizing: border-box;
          }

          .fm-otp-help {
            margin-top: 7px;
            text-align: center;
            font-size: 10px;
          }

          .fm-change {
            display: block;
            width: 100%;
            margin-top: 18px;
            border: 0;
            background: transparent;
            font-size: 12px;
            cursor: pointer;
          }

          /* =========================================================
             BOTTOM
          ========================================================= */

          .fm-divider {
            width: 100%;
            height: 1px;
            margin-top: 28px;
          }

          .fm-form-footer {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-top: 14px;
            font-size: 10px;
          }

          /* =========================================================
             RESPONSIVE
          ========================================================= */

          @media (max-width: 900px) {
            .fm-shell {
              max-width: 500px;
              min-height: auto;
              grid-template-columns: 1fr;
            }

            .fm-brand-panel {
              padding: 34px;
            }

            .fm-brand-panel::before {
              width: 100%;
              height: 4px;
              bottom: auto;
            }

            .fm-brand-kicker {
              margin-top: 30px;
            }

            .fm-brand-title {
              font-size: 28px;
            }

            .fm-feature-list {
              display: none;
            }

            .fm-brand-footer {
              margin-top: 35px;
            }

            .fm-form-panel {
              padding: 38px 34px;
            }
          }

          @media (max-width: 520px) {
            .fm-login {
              padding: 16px;
            }

            .fm-shell {
              border-radius: 12px;
            }

            .fm-brand-panel {
              padding: 28px 24px;
            }

            .fm-form-panel {
              padding: 30px 22px;
            }

            .fm-brand-title {
              font-size: 25px;
            }

            .fm-brand-description {
              font-size: 13px;
            }

            .fm-form-top {
              margin-bottom: 22px;
            }

            .fm-console-label {
              font-size: 9px;
            }

            .fm-status {
              font-size: 9px;
            }
          }
        `}
      </style>

      <div
        className="
          fm-login
          flex
          min-h-screen
          w-full
          items-center
          justify-center
          bg-background
          px-4
          py-8
          sm:px-6
        "
      >
        <div
          className="
            fm-shell
            border
            border-accent
            bg-white
          "
        >
          {/* =====================================================
              LEFT BRAND / PRODUCT PANEL
          ===================================================== */}

          <div
            className="
              fm-brand-panel
              border-r
              border-accent
              bg-background
            "
          >
            <div
              className="
                absolute
                left-0
                top-0
                h-full
                w-1
                bg-primary
              "
            />

            <div>
              {/* Logo */}
              <img
                src={logo}
                alt="FixMantra"
                className="fm-brand-logo"
              />

              {/* Kicker */}
              <div className="fm-brand-kicker text-primary">
                <span className="bg-primary" />
                Admin Console
              </div>

              {/* Main Message */}
              <h2 className="fm-brand-title text-primary">
                Everything you need to manage your service operations.
              </h2>

              <p className="fm-brand-description text-secondary">
                Access your administration workspace to manage customers,
                service requests and day-to-day business operations from one
                place.
              </p>

              {/* Product Features */}
              <div className="fm-feature-list">
                <div
                  className="
                    fm-feature
                    border
                    border-accent
                    bg-white
                  "
                >
                  <div
                    className="
                      fm-feature-icon
                      bg-accent
                      text-primary
                    "
                  >
                    <FiCheckCircle className="text-sm" />
                  </div>

                  <span className="fm-feature-text text-primary">
                    Manage service requests efficiently
                  </span>
                </div>

                <div
                  className="
                    fm-feature
                    border
                    border-accent
                    bg-white
                  "
                >
                  <div
                    className="
                      fm-feature-icon
                      bg-accent
                      text-primary
                    "
                  >
                    <FiCheckCircle className="text-sm" />
                  </div>

                  <span className="fm-feature-text text-primary">
                    Keep customer operations organized
                  </span>
                </div>

                <div
                  className="
                    fm-feature
                    border
                    border-accent
                    bg-white
                  "
                >
                  <div
                    className="
                      fm-feature-icon
                      bg-accent
                      text-primary
                    "
                  >
                    <FiCheckCircle className="text-sm" />
                  </div>

                  <span className="fm-feature-text text-primary">
                    Monitor your business activity
                  </span>
                </div>
              </div>
            </div>

            {/* Left Footer */}
            <div className="fm-brand-footer text-secondary">
              Built for simple, reliable service management.
            </div>
          </div>

          {/* =====================================================
              RIGHT LOGIN PANEL
          ===================================================== */}

          <div className="fm-form-panel bg-white">
            <div className="fm-form-container">
              {/* Top Information */}
              <div className="fm-form-top">
                <span className="fm-console-label text-primary">
                  FIXMANTRA ADMIN
                </span>
              </div>

              {!isOtpSent ? (
                <>
                  {/* Heading */}
                  <div className="fm-heading">
                    <h1 className="text-primary">
                      Welcome back
                    </h1>

                    <p className="text-secondary">
                      Sign in to continue to your administration workspace.
                    </p>
                  </div>

                  {/* Login Method */}
                  <div
                    className="
                      fm-methods
                      border
                      border-accent
                      bg-background
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleChangeLoginMethod("otp")
                      }
                      className={`
                        fm-method
                        ${
                          loginMethod === "otp"
                            ? "border-accent bg-white text-primary shadow-sm"
                            : "text-secondary hover:text-primary"
                        }
                      `}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <FaPhoneAlt className="text-[10px]" />
                        Mobile
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleChangeLoginMethod("email")
                      }
                      className={`
                        fm-method
                        ${
                          loginMethod === "email"
                            ? "border-accent bg-white text-primary shadow-sm"
                            : "text-secondary hover:text-primary"
                        }
                      `}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <IoMdMail className="text-sm" />
                        Email
                      </span>
                    </button>
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-5"
                  >
                    {/* Mobile */}
                    {loginMethod === "otp" ? (
                      <div>
                        <label className="fm-label text-primary">
                          Mobile number
                        </label>

                        <div
                          className="
                            fm-phone
                            border-accent
                            bg-white
                            text-primary
                            focus-within:border-primary
                          "
                        >
                          <PhoneInput
                            country={userCountry}
                            onChange={handlePhoneChange}
                            inputProps={{
                              name: "phone",
                              required: true,
                            }}
                            containerClass="w-full"
                            inputClass="!rounded-none"
                            buttonClass="!rounded-none"
                            dropdownClass="!rounded-xl"
                          />

                          <input
                            {...register("phoneNumber", {
                              required:
                                loginMethod === "otp"
                                  ? "Please enter your Phone number"
                                  : false,
                            })}
                            type="hidden"
                          />

                          <input
                            {...register("countryCode", {
                              required:
                                loginMethod === "otp"
                                  ? "Please select your country code"
                                  : false,
                            })}
                            type="hidden"
                          />
                        </div>
                      </div>
                    ) : (
                      /* Email */
                      <div>
                        <label className="fm-label text-primary">
                          Email address
                        </label>

                        <div
                          className="
                            fm-email
                            border-accent
                            bg-white
                          "
                        >
                          <div
                            className="
                              fm-email-icon
                              border-accent
                              text-secondary
                            "
                          >
                            <IoMdMail className="text-lg" />
                          </div>

                          <input
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", {
                              required:
                                loginMethod === "email"
                                  ? "Please enter your Email"
                                  : false,
                              onChange: (e) =>
                                setEnteredEmail(
                                  e.target.value,
                                ),
                            })}
                            className="text-primary placeholder:text-secondary placeholder:opacity-60"
                          />
                        </div>
                      </div>
                    )}

                    {/* Errors */}
                    <div className="mt-2">
                      <Error
                        errorName={errors.countryCode}
                      />

                      <Error
                        errorName={errors.phoneNumber}
                      />

                      <Error
                        errorName={errors.email}
                      />
                    </div>

                    {/* Security */}
                    <div
                      className="
                        fm-security
                        border-accent
                        bg-background
                      "
                    >
                      <div
                        className="
                          fm-security-icon
                          bg-accent
                          text-primary
                        "
                      >
                        <FiShield className="text-sm" />
                      </div>

                      <div>
                        <p className="fm-security-title text-primary">
                          Secure sign in
                        </p>

                        <p className="fm-security-text text-secondary">
                          Your verification details are kept protected.
                        </p>
                      </div>
                    </div>

                    {/* Continue */}
                    <Button
                      type="submit"
                      className="
                        fm-button
                        !flex
                        items-center
                        justify-center
                        !bg-primary
                        !text-white
                        hover:!bg-secondary
                      "
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Continue
                          <FaArrowRight className="text-[10px]" />
                        </span>
                      )}
                    </Button>

                    {/* Signup */}
                    <p className="fm-signup text-secondary">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="
                          text-primary
                          hover:text-secondary
                        "
                      >
                        Sign up
                      </Link>
                    </p>
                  </form>
                </>
              ) : (
                /* =================================================
                   OTP SCREEN
                ================================================= */

                <div>
                  <div className="fm-otp-header">
                    <div
                      className="
                        fm-otp-icon
                        border-accent
                        bg-accent
                        text-primary
                      "
                    >
                      <FiLock className="text-xl" />
                    </div>

                    <h2 className="text-primary">
                      Verify your account
                    </h2>

                    <p className="text-secondary">
                      {loginMethod === "otp"
                        ? `Enter the verification code sent to ${maskedNumber}.`
                        : `Enter the verification code sent to ${maskedEmail}.`}
                    </p>
                  </div>

                  {/* OTP */}
                  <div className="mt-7">
                    <label className="fm-otp-label text-primary">
                      Verification code
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value.replace(
                            /\D/g,
                            "",
                          ),
                        )
                      }
                      className="
                        fm-otp
                        border-accent
                        bg-white
                        text-primary
                        placeholder:text-secondary
                        placeholder:opacity-30
                        focus:border-primary
                      "
                      maxLength={6}
                      autoComplete="one-time-code"
                    />

                    <p className="fm-otp-help text-secondary">
                      Enter the 6-digit verification code
                    </p>
                  </div>

                  {/* Verify */}
                  <Button
                    type="button"
                    onClick={handleOtpSubmit}
                    className="
                      fm-button
                      !flex
                      items-center
                      justify-center
                      !bg-primary
                      !text-white
                      hover:!bg-secondary
                    "
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Verify & Continue
                        <FaArrowRight className="text-[10px]" />
                      </span>
                    )}
                  </Button>

                  {/* Change */}
                  <button
                    type="button"
                    className="
                      fm-change
                      text-secondary
                      hover:text-primary
                    "
                    onClick={() => {
                      setIsOtpSent(false);
                      setIsLoading(false);
                      setOtp("");
                    }}
                  >
                    ← Try a different{" "}
                    {loginMethod === "otp"
                      ? "phone number"
                      : "email"}
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="fm-divider bg-accent" />

              <div className="fm-form-footer text-secondary">
                <FiShield className="text-xs" />
                Secure FixMantra Admin Portal
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;