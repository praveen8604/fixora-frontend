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
    "*"
  );

  const maskedEmail = enteredEmail?.replace(
    /^(.)(.*)(@.*)$/,
    (match, firstChar, middleChars, domain) =>
      firstChar + middleChars.replace(/./g, "*") + domain
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

    const formattedCountryCode = dialCode ? `+${dialCode}` : "";

    setValue("countryCode", formattedCountryCode);
    setValue("phoneNumber", nationalNumber);

    setEnteredMobileNumber(nationalNumber);
    setEnteredCountryCode(formattedCountryCode);
  };

  const goToDashboard = (data = {}) => {
    const adminPayload = {
      _id: data._id || "local-admin",
      userName: data.userName || data.name || "Admin",
      email:
        data.email ||
        enteredEmail ||
        "admin@fixmantra.com",
      phoneNumber:
        data.phoneNumber ||
        enteredMobileNumber ||
        "",
      countryCode:
        data.countryCode ||
        enteredCountryCode ||
        "+91",
      role: data.role || "Admin",
      createdAt:
        data.createdAt ||
        new Date().toISOString(),
    };

    const token =
      data.token ||
      data.accessToken ||
      "local-session";

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
      }
    );

    Cookies.set(
      "token",
      JSON.stringify(token),
      {
        expires: cookieTimeOut,
      }
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
            }
          : {
              email: data.email,
            };

      await AdminServices.loginOTPAdmin(payload);

      if (loginMethod === "otp") {
        setEnteredMobileNumber(data.phoneNumber);
        setEnteredCountryCode(data.countryCode);
      } else {
        setEnteredEmail(data.email);
      }

      notifySuccess("OTP sent successfully!");

      setIsOtpSent(true);
    } catch (error) {
      notifyError(
        error?.response?.data?.message ||
          "Failed to send OTP."
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
              otp,
            }
          : {
              email: enteredEmail,
              otp,
            };

      const res = await AdminServices.verifyOTP(payload);

      reduxDispatch(removeSetting("globalSetting"));

      goToDashboard(
        res?.data || {
          email: enteredEmail,
          phoneNumber: enteredMobileNumber,
          countryCode: enteredCountryCode,
        }
      );
    } catch (error) {
      notifyError(
        error?.response?.data?.message ||
          "Invalid OTP."
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
             Clean / Premium / Product-focused
          ========================================================= */

          .fm-login {
            min-height: 100vh;
            background: #f5f7fa;
            color: #111827;
          }

          .fm-shell {
            width: 100%;
            max-width: 1120px;
            min-height: 650px;
            display: grid;
            grid-template-columns: 0.92fr 1.08fr;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            overflow: hidden;
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
            background: #f8fafc;
            border-right: 1px solid #e5e7eb;
          }

          .fm-brand-panel::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: #2563eb;
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
            color: #2563eb;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.14em;
          }

          .fm-brand-kicker span {
            width: 22px;
            height: 2px;
            background: #2563eb;
          }

          .fm-brand-title {
            margin-top: 14px;
            max-width: 390px;
            color: #111827;
            font-size: 34px;
            line-height: 1.18;
            font-weight: 700;
            letter-spacing: -0.035em;
          }

          .fm-brand-description {
            max-width: 385px;
            margin-top: 16px;
            color: #667085;
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
            background: #ffffff;
            border: 1px solid #e6e9ee;
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
            background: #eff6ff;
            color: #2563eb;
          }

          .fm-feature-text {
            color: #374151;
            font-size: 12px;
            font-weight: 600;
          }

          .fm-brand-footer {
            color: #98a2b3;
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
            background: #ffffff;
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
            color: #667085;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.04em;
          }

          .fm-status {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #667085;
            font-size: 10px;
          }

          .fm-status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #22c55e;
          }

          .fm-heading h1 {
            color: #101828;
            font-size: 28px;
            line-height: 1.2;
            font-weight: 700;
            letter-spacing: -0.025em;
          }

          .fm-heading p {
            margin-top: 8px;
            color: #667085;
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
            background: #f2f4f7;
            border: 1px solid #e4e7ec;
            border-radius: 10px;
          }

          .fm-method {
            height: 42px;
            border: 1px solid transparent;
            border-radius: 7px;
            background: transparent;
            color: #667085;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .fm-method:hover {
            color: #344054;
          }

          .fm-method.active {
            background: #ffffff;
            border-color: #e4e7ec;
            color: #1d2939;
            box-shadow: 0 1px 3px rgba(16, 24, 40, 0.07);
          }

          /* =========================================================
             LABELS
          ========================================================= */

          .fm-label {
            display: block;
            margin-bottom: 8px;
            color: #344054;
            font-size: 12px;
            font-weight: 600;
          }

          /* =========================================================
             PHONE INPUT
          ========================================================= */

          .fm-phone {
            width: 100%;
            height: 48px;
            overflow: hidden;
            border: 1px solid #d0d5dd;
            border-radius: 9px;
            background: #ffffff;
            transition:
              border-color 0.2s ease,
              box-shadow 0.2s ease;
          }

          .fm-phone:focus-within {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
          }

          .fm-phone .form-control {
            width: 100% !important;
            height: 46px !important;
            border: none !important;
            background: transparent !important;
            color: #101828 !important;
            font-size: 14px !important;
            padding-left: 58px !important;
          }

          .fm-phone .form-control::placeholder {
            color: #98a2b3 !important;
          }

          .fm-phone .flag-dropdown {
            background: #ffffff !important;
            border: none !important;
            border-right: 1px solid #eaecf0 !important;
            border-radius: 9px 0 0 9px !important;
          }

          .fm-phone .selected-flag {
            height: 46px !important;
            background: transparent !important;
            border-radius: 9px 0 0 9px !important;
          }

          .fm-phone .selected-flag:hover {
            background: #f9fafb !important;
          }

          .fm-phone .country-list {
            background: #ffffff !important;
            color: #344054 !important;
            border: 1px solid #e4e7ec !important;
            border-radius: 9px !important;
            box-shadow: 0 12px 25px rgba(16, 24, 40, 0.1) !important;
          }

          .fm-phone .country-list .country:hover {
            background: #f2f4f7 !important;
          }

          .fm-phone .country-list .country.highlight {
            background: #eff6ff !important;
          }

          /* =========================================================
             EMAIL INPUT
          ========================================================= */

          .fm-email {
            display: flex;
            width: 100%;
            height: 48px;
            overflow: hidden;
            border: 1px solid #d0d5dd;
            border-radius: 9px;
            background: #ffffff;
            transition:
              border-color 0.2s ease,
              box-shadow 0.2s ease;
          }

          .fm-email:focus-within {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
          }

          .fm-email-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 46px;
            flex-shrink: 0;
            border-right: 1px solid #eaecf0;
            color: #667085;
          }

          .fm-email input {
            width: 100%;
            height: 46px;
            padding: 0 14px;
            border: 0;
            outline: none;
            background: transparent;
            color: #101828;
            font-size: 14px;
          }

          .fm-email input::placeholder {
            color: #98a2b3;
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
            border: 1px solid #eaecf0;
            border-radius: 9px;
            background: #fafafa;
          }

          .fm-security-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            flex-shrink: 0;
            border-radius: 7px;
            background: #eff6ff;
            color: #2563eb;
          }

          .fm-security-title {
            color: #475467;
            font-size: 11px;
            font-weight: 600;
          }

          .fm-security-text {
            margin-top: 2px;
            color: #98a2b3;
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
            background: #2563eb !important;
            color: #ffffff !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            box-shadow: none !important;
            transition:
              background-color 0.2s ease,
              transform 0.15s ease;
          }

          .fm-button:hover {
            background: #1d4ed8 !important;
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
            color: #667085;
            font-size: 12px;
          }

          .fm-signup a {
            color: #2563eb;
            font-weight: 600;
            transition: color 0.2s ease;
          }

          .fm-signup a:hover {
            color: #1d4ed8;
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
            border: 1px solid #dbeafe;
            border-radius: 10px;
            background: #eff6ff;
            color: #2563eb;
          }

          .fm-otp-header h2 {
            color: #101828;
            font-size: 22px;
            font-weight: 700;
          }

          .fm-otp-header p {
            max-width: 320px;
            margin: 8px auto 0;
            color: #667085;
            font-size: 13px;
            line-height: 1.6;
          }

          .fm-otp-label {
            margin-bottom: 8px;
            color: #344054;
            font-size: 12px;
            font-weight: 600;
          }

          .fm-otp {
            width: 100%;
            height: 54px;
            border: 1px solid #d0d5dd;
            border-radius: 9px;
            outline: none;
            background: #ffffff;
            color: #101828;
            text-align: center;
            font-size: 21px;
            font-weight: 600;
            letter-spacing: 0.55em;
            padding-left: 0.55em;
            transition:
              border-color 0.2s ease,
              box-shadow 0.2s ease;
          }

          .fm-otp:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
          }

          .fm-otp::placeholder {
            color: #d0d5dd;
          }

          .fm-otp-help {
            margin-top: 7px;
            text-align: center;
            color: #98a2b3;
            font-size: 10px;
          }

          .fm-change {
            display: block;
            width: 100%;
            margin-top: 18px;
            border: 0;
            background: transparent;
            color: #667085;
            font-size: 12px;
            cursor: pointer;
            transition: color 0.2s ease;
          }

          .fm-change:hover {
            color: #2563eb;
          }

          /* =========================================================
             BOTTOM
          ========================================================= */

          .fm-divider {
            width: 100%;
            height: 1px;
            margin-top: 28px;
            background: #eaecf0;
          }

          .fm-form-footer {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-top: 14px;
            color: #98a2b3;
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
              border-right: 0;
              border-bottom: 1px solid #e5e7eb;
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

      <div className="fm-login flex w-full items-center justify-center px-4 py-8 sm:px-6">
        <div className="fm-shell">

          {/* =====================================================
              LEFT BRAND / PRODUCT PANEL
          ===================================================== */}

          <div className="fm-brand-panel">
            <div>

              {/* Logo */}
              <img
                src={logo}
                alt="FixMantra"
                className="fm-brand-logo"
              />

              {/* Kicker */}
              <div className="fm-brand-kicker">
                <span />
                Admin Console
              </div>

              {/* Main Message */}
              <h2 className="fm-brand-title">
                Everything you need to manage your service operations.
              </h2>

              <p className="fm-brand-description">
                Access your administration workspace to manage customers,
                service requests and day-to-day business operations from
                one place.
              </p>

              {/* Product Features */}
              <div className="fm-feature-list">

                <div className="fm-feature">
                  <div className="fm-feature-icon">
                    <FiCheckCircle className="text-sm" />
                  </div>

                  <span className="fm-feature-text">
                    Manage service requests efficiently
                  </span>
                </div>

                <div className="fm-feature">
                  <div className="fm-feature-icon">
                    <FiCheckCircle className="text-sm" />
                  </div>

                  <span className="fm-feature-text">
                    Keep customer operations organized
                  </span>
                </div>

                <div className="fm-feature">
                  <div className="fm-feature-icon">
                    <FiCheckCircle className="text-sm" />
                  </div>

                  <span className="fm-feature-text">
                    Monitor your business activity
                  </span>
                </div>

              </div>
            </div>

            {/* Left Footer */}
            <div className="fm-brand-footer">
              Built for simple, reliable service management.
            </div>
          </div>

          {/* =====================================================
              RIGHT LOGIN PANEL
          ===================================================== */}

          <div className="fm-form-panel">
            <div className="fm-form-container">

              {/* Top Information */}
              <div className="fm-form-top">
                <span className="fm-console-label">
                  FIXMANTRA ADMIN
                </span>

                <span className="fm-status">
                  <span className="fm-status-dot" />
                  System available
                </span>
              </div>

              {!isOtpSent ? (
                <>
                  {/* Heading */}
                  <div className="fm-heading">
                    <h1>Welcome back</h1>

                    <p>
                      Sign in to continue to your administration workspace.
                    </p>
                  </div>

                  {/* Login Method */}
                  <div className="fm-methods">

                    <button
                      type="button"
                      onClick={() =>
                        handleChangeLoginMethod("otp")
                      }
                      className={`fm-method ${
                        loginMethod === "otp"
                          ? "active"
                          : ""
                      }`}
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
                      className={`fm-method ${
                        loginMethod === "email"
                          ? "active"
                          : ""
                      }`}
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

                        <label className="fm-label">
                          Mobile number
                        </label>

                        <div className="fm-phone">

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

                        <label className="fm-label">
                          Email address
                        </label>

                        <div className="fm-email">

                          <div className="fm-email-icon">
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
                                  e.target.value
                                ),
                            })}
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
                    <div className="fm-security">

                      <div className="fm-security-icon">
                        <FiShield className="text-sm" />
                      </div>

                      <div>
                        <p className="fm-security-title">
                          Secure sign in
                        </p>

                        <p className="fm-security-text">
                          Your verification details are kept protected.
                        </p>
                      </div>

                    </div>

                    {/* Continue */}
                    <Button
                      type="submit"
                      className="fm-button !flex items-center justify-center"
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
                    <p className="fm-signup">
                      Don't have an account?{" "}

                      <Link to="/signup">
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

                    <div className="fm-otp-icon">
                      <FiLock className="text-xl" />
                    </div>

                    <h2>
                      Verify your account
                    </h2>

                    <p>
                      {loginMethod === "otp"
                        ? `Enter the verification code sent to ${maskedNumber}.`
                        : `Enter the verification code sent to ${maskedEmail}.`}
                    </p>

                  </div>

                  {/* OTP */}
                  <div className="mt-7">

                    <label className="fm-otp-label">
                      Verification code
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      className="fm-otp"
                      maxLength={6}
                      autoComplete="one-time-code"
                    />

                    <p className="fm-otp-help">
                      Enter the 6-digit verification code
                    </p>

                  </div>

                  {/* Verify */}
                  <Button
                    type="button"
                    onClick={handleOtpSubmit}
                    className="fm-button !flex items-center justify-center"
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
                    className="fm-change"
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
              <div className="fm-divider" />

              <div className="fm-form-footer">
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