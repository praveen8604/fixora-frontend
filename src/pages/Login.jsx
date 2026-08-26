import React, { useContext, useEffect, useState } from "react";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt, FaArrowRight } from "react-icons/fa";
import { FiShield, FiLock, FiActivity } from "react-icons/fi";
import { Button } from "@windmill/react-ui";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "@/utils/toast";
import Error from "@/components/form/others/Error";
import loginvideo from "@/assets/img/loginvideo.mp4";
import logo from "@/assets/img/logo/logo.png";
import { AdminContext } from "@/context/AdminContext";
import { removeSetting } from "@/reduxStore/slice/settingSlice";
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
    /^(.)(.*)(.@.*)$/,
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
      .catch(() => {
        setUserCountry("in");
      });
  }, []);

  const handlePhoneChange = (value, country) => {
    const dialCode = country?.dialCode || "";

    const nationalNumber = value.startsWith(dialCode)
      ? value.slice(dialCode.length)
      : value;

    const countryCode = `+${dialCode}`;

    setEnteredMobileNumber(nationalNumber);
    setEnteredCountryCode(countryCode);

    setValue("countryCode", countryCode);
    setValue("phoneNumber", nationalNumber);
  };

  const goToDashboard = (data = {}) => {
    const adminPayload = {
      _id: "local-admin",
      userName: "Admin",
      email: data.email || "admin@fixora.com",
      phoneNumber: data.phoneNumber || "",
      countryCode: data.countryCode || "+91",
      role: "Admin",
      createdAt: new Date().toISOString(),
    };

    dispatch({
      type: "USER_LOGIN",
      payload: adminPayload,
    });

    localStorage.setItem("theme", "light");

    Cookies.set("adminInfo", JSON.stringify(adminPayload), {
      expires: cookieTimeOut,
    });

    Cookies.set("token", JSON.stringify("local-session"), {
      expires: cookieTimeOut,
    });

    notifySuccess("Login Success!");

    window.location.replace("/dashboard");
  };

  const onSubmit = (data) => {
    try {
      setIsLoading(true);

      reduxDispatch(removeSetting("globalSetting"));

      if (loginMethod === "otp") {
        setEnteredMobileNumber(data.phoneNumber || "");
        setEnteredCountryCode(data.countryCode || "+91");

        setIsOtpSent(true);
        setIsLoading(false);
        return;
      }

      if (loginMethod === "email") {
        setEnteredEmail(data.email || "");

        setIsOtpSent(true);
        setIsLoading(false);
        return;
      }

      goToDashboard(data);
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      notifyError("Something went wrong. Please try again.");
    }
  };

  const handleOtpSubmit = () => {
    if (otp.length === 6) {
      goToDashboard({
        email: enteredEmail,
        phoneNumber: enteredMobileNumber,
        countryCode: enteredCountryCode,
      });
    } else {
      notifyError("Please enter a valid 6-digit OTP.");
    }
  };

  const changeLoginMethod = (method) => {
    setLoginMethod(method);
    setIsOtpSent(false);
    setOtp("");
    setIsLoading(false);
  };

  return (
    <>
      <style>
        {`
          @keyframes loginGradient {
            0% {
              background-position: 0% 50%;
            }

            50% {
              background-position: 100% 50%;
            }

            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes floatOne {
            0%, 100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(35px, -25px, 0) scale(1.08);
            }
          }

          @keyframes floatTwo {
            0%, 100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(-30px, 30px, 0) scale(0.94);
            }
          }

          @keyframes floatThree {
            0%, 100% {
              transform: translate3d(0, 0, 0);
            }

            50% {
              transform: translate3d(20px, 25px, 0);
            }
          }

          @keyframes pulseGlow {
            0%, 100% {
              opacity: .35;
              transform: scale(1);
            }

            50% {
              opacity: .65;
              transform: scale(1.15);
            }
          }

          @keyframes gridMove {
            0% {
              transform: translateY(0);
            }

            100% {
              transform: translateY(45px);
            }
          }

          @keyframes cardEnter {
            from {
              opacity: 0;
              transform: translateY(25px) scale(.98);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes slideRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-120%);
            }

            100% {
              transform: translateX(120%);
            }
          }

          .login-card-animation {
            animation: cardEnter .7s ease-out both;
          }

          .login-video-animation {
            animation: slideRight .8s ease-out both;
          }

          .login-gradient {
            background:
              radial-gradient(
                circle at 10% 15%,
                rgba(80, 88, 156, .18),
                transparent 30%
              ),
              radial-gradient(
                circle at 90% 80%,
                rgba(14, 165, 233, .13),
                transparent 32%
              ),
              linear-gradient(
                135deg,
                #f7f9ff 0%,
                #eef2ff 45%,
                #f4f9ff 100%
              );

            background-size: 180% 180%;
            animation: loginGradient 16s ease infinite;
          }

          .login-grid {
            background-image:
              linear-gradient(
                rgba(80, 88, 156, .035) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(80, 88, 156, .035) 1px,
                transparent 1px
              );

            background-size: 42px 42px;
            animation: gridMove 12s linear infinite;
          }

          .login-orb-one {
            animation: floatOne 8s ease-in-out infinite;
          }

          .login-orb-two {
            animation: floatTwo 10s ease-in-out infinite;
          }

          .login-orb-three {
            animation: floatThree 7s ease-in-out infinite;
          }

          .login-pulse {
            animation: pulseGlow 4s ease-in-out infinite;
          }

          .login-shimmer {
            position: relative;
          }

          .login-shimmer::after {
            content: "";
            position: absolute;
            inset: 0;
            width: 40%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.22),
              transparent
            );
            transform: translateX(-120%);
            animation: shimmer 5s ease-in-out infinite;
          }

          .login-input {
            transition:
              border-color .2s ease,
              box-shadow .2s ease,
              transform .2s ease;
          }

          .login-input:focus {
            border-color: #50589c !important;
            box-shadow: 0 0 0 4px rgba(80, 88, 156, .09);
          }

          .login-tab {
            transition:
              transform .2s ease,
              box-shadow .2s ease,
              background .2s ease;
          }

          .login-tab:hover {
            transform: translateY(-1px);
          }

          .login-button {
            transition:
              transform .2s ease,
              box-shadow .2s ease,
              background .2s ease;
          }

          .login-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 28px rgba(80, 88, 156, .25);
          }

          .login-button:active {
            transform: translateY(0);
          }

          .login-video-card {
            box-shadow:
              0 30px 80px rgba(41, 55, 105, .20),
              inset 0 1px 0 rgba(255,255,255,.35);
          }
        `}
      </style>

      <div className="login-gradient relative flex h-screen min-h-screen overflow-hidden">
        {/* Animated Grid */}
        <div className="login-grid pointer-events-none absolute inset-0 z-0" />

        {/* Floating Orb 1 */}
        <div
          className="
            login-orb-one
            pointer-events-none
            absolute
            -left-24
            top-[-90px]
            z-0
            h-72
            w-72
            rounded-full
            bg-[#50589C]/10
            blur-3xl
          "
        />

        {/* Floating Orb 2 */}
        <div
          className="
            login-orb-two
            pointer-events-none
            absolute
            right-[35%]
            top-[18%]
            z-0
            h-64
            w-64
            rounded-full
            bg-[#38BDF8]/10
            blur-3xl
          "
        />

        {/* Floating Orb 3 */}
        <div
          className="
            login-orb-three
            pointer-events-none
            absolute
            bottom-[-100px]
            left-[35%]
            z-0
            h-80
            w-80
            rounded-full
            bg-[#818CF8]/10
            blur-3xl
          "
        />

        {/* =====================================================
            LEFT LOGIN AREA
        ====================================================== */}
        <div
          className="
            relative
            z-10
            flex
            w-full
            items-center
            justify-center
            overflow-y-auto
            px-5
            py-8
            sm:px-8
            lg:w-1/2
            lg:px-14
            xl:px-20
          "
        >
          <div className="login-card-animation w-full max-w-[440px]">
            {/* Brand */}
            <div className="mb-7 flex items-center justify-between">
              <div
                className="
                  inline-flex
                  items-center
                  rounded-2xl
                  border
                  border-white/80
                  bg-white/80
                  px-5
                  py-3
                  shadow-[0_12px_35px_rgba(80,88,156,.10)]
                  backdrop-blur-xl
                "
              >
                <img
                  src={logo}
                  alt="Fixora"
                  className="h-10 w-auto object-contain"
                />
              </div>

              <div
                className="
                  hidden
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#50589C]/10
                  bg-white/70
                  px-3
                  py-2
                  text-[11px]
                  font-semibold
                  text-[#50589C]
                  shadow-sm
                  backdrop-blur-md
                  sm:flex
                "
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="
                      login-pulse
                      absolute
                      inline-flex
                      h-full
                      w-full
                      rounded-full
                      bg-[#22C55E]
                    "
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
                </span>

                Secure access
              </div>
            </div>

            {/* Heading */}
            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-[2px] w-8 rounded-full bg-[#50589C]" />

                <span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#50589C]">
                  Admin Console
                </span>
              </div>

              <h1 className="text-[30px] font-bold tracking-[-.035em] text-[#26315F] sm:text-[34px]">
                {!isOtpSent ? "Welcome back" : "Verify your account"}
              </h1>

              <p className="mt-2 max-w-[390px] text-sm leading-6 text-[#64748B]">
                {!isOtpSent
                  ? "Sign in to manage your service operations, customers and business activity."
                  : "Enter the verification code to securely continue to your dashboard."}
              </p>
            </div>

            {/* Login Card */}
            <div
              className="
                rounded-[26px]
                border
                border-white/80
                bg-white/75
                p-5
                shadow-[0_25px_70px_rgba(61,72,130,.13)]
                backdrop-blur-2xl
                sm:p-6
              "
            >
              {!isOtpSent ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Login Method Tabs */}
                  <div
                    className="
                      mb-6
                      grid
                      grid-cols-2
                      gap-1.5
                      rounded-2xl
                      border
                      border-[#E6EAF5]
                      bg-[#F5F7FC]
                      p-1.5
                    "
                  >
                    <button
                      type="button"
                      onClick={() => changeLoginMethod("otp")}
                      className={`
                        login-tab
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        px-3
                        py-3
                        text-sm
                        font-semibold
                        ${
                          loginMethod === "otp"
                            ? "bg-white text-[#50589C] shadow-[0_5px_15px_rgba(80,88,156,.10)]"
                            : "text-[#64748B] hover:bg-white/60 hover:text-[#50589C]"
                        }
                      `}
                    >
                      <FaPhoneAlt className="h-3.5 w-3.5" />
                      Mobile
                    </button>

                    <button
                      type="button"
                      onClick={() => changeLoginMethod("email")}
                      className={`
                        login-tab
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        px-3
                        py-3
                        text-sm
                        font-semibold
                        ${
                          loginMethod === "email"
                            ? "bg-white text-[#50589C] shadow-[0_5px_15px_rgba(80,88,156,.10)]"
                            : "text-[#64748B] hover:bg-white/60 hover:text-[#50589C]"
                        }
                      `}
                    >
                      <IoMdMail className="h-4 w-4" />
                      Email
                    </button>
                  </div>

                  {/* Mobile Login */}
                  {loginMethod === "otp" ? (
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-[#33406D]">
                        Mobile number
                      </label>

                      <div className="overflow-hidden rounded-xl bg-white">
                        <PhoneInput
                          country={userCountry}
                          onChange={handlePhoneChange}
                          inputProps={{
                            name: "phone",
                            required: true,
                          }}
                          containerClass="text-left"
                          inputClass="
                            !h-[48px]
                            !w-full
                            !rounded-xl
                            !border-[#E2E7F0]
                            !bg-white
                            !text-[#26315F]
                            !placeholder-[#9AA4B5]
                            login-input
                          "
                          buttonClass="
                            !border-[#E2E7F0]
                            !bg-[#F5F7FC]
                            !rounded-l-xl
                          "
                          dropdownClass="
                            !bg-white
                            !text-[#26315F]
                          "
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
                          {...register("countryCode")}
                          type="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Email Login */
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-[#33406D]">
                        Email address
                      </label>

                      <div
                        className="
                          flex
                          overflow-hidden
                          rounded-xl
                          border
                          border-[#E2E7F0]
                          bg-white
                          focus-within:border-[#50589C]
                        "
                      >
                        <div
                          className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            bg-[#EEF0FF]
                            text-[#50589C]
                          "
                        >
                          <IoMdMail className="text-lg" />
                        </div>

                        <input
                          placeholder="Enter your email"
                          className="
                            login-input
                            h-12
                            w-full
                            border-0
                            bg-transparent
                            px-3
                            text-sm
                            text-[#26315F]
                            placeholder-[#9AA4B5]
                            outline-none
                          "
                          {...register("email", {
                            required:
                              loginMethod === "email"
                                ? "Please enter your Email"
                                : false,
                            onChange: (e) =>
                              setEnteredEmail(e.target.value),
                          })}
                        />
                      </div>
                    </div>
                  )}

                  <Error errorName={errors.countryCode} />
                  <Error errorName={errors.phoneNumber} />
                  <Error errorName={errors.email} />

                  {/* Security Information */}
                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-[#E8EBF5]
                      bg-[#F8F9FD]
                      px-3
                      py-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#EEF0FF]
                        text-[#50589C]
                      "
                    >
                      <FiShield className="text-sm" />
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-[#33406D]">
                        Secure authentication
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#8490A5]">
                        Your information is protected
                      </p>
                    </div>
                  </div>

                  {/* Continue */}
                  <Button
                    type="submit"
                    className="
                      login-button
                      relative
                      mt-5
                      h-12
                      w-full
                      overflow-hidden
                      rounded-xl
                      !bg-[#50589C]
                      text-sm
                      font-semibold
                      text-white
                      !shadow-[0_8px_22px_rgba(80,88,156,.22)]
                      hover:!bg-[#454D8C]
                    "
                    disabled={isLoading}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        "Signing in..."
                      ) : (
                        <>
                          Continue
                          <FaArrowRight className="text-xs" />
                        </>
                      )}
                    </span>
                  </Button>

                  {/* Signup */}
                  <p className="mt-5 text-center text-xs text-[#7A879B]">
                    Don’t have an account?{" "}
                    <Link
                      to="/signup"
                      className="
                        font-bold
                        text-[#50589C]
                        transition-colors
                        hover:text-[#303866]
                      "
                    >
                      Sign up
                    </Link>
                  </p>
                </form>
              ) : (
                /* OTP Screen */
                <div>
                  <div className="mb-5 flex items-center justify-center">
                    <div
                      className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[#EEF0FF]
                        text-[#50589C]
                        shadow-[0_8px_25px_rgba(80,88,156,.10)]
                      "
                    >
                      <FiLock className="text-2xl" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-lg font-bold text-[#26315F]">
                      Verification code
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-[#718096]">
                      {loginMethod === "otp"
                        ? `Enter the OTP sent to ${maskedNumber}.`
                        : `Enter the OTP sent to ${maskedEmail}.`}
                    </p>
                  </div>

                  <div className="mt-6">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      className="
                        login-input
                        h-14
                        w-full
                        rounded-xl
                        border
                        border-[#E2E7F0]
                        bg-white
                        px-4
                        text-center
                        text-xl
                        font-semibold
                        tracking-[0.55em]
                        text-[#26315F]
                        outline-none
                        placeholder-[#CBD2DF]
                      "
                      maxLength={6}
                    />

                    <p className="mt-2 text-center text-[10px] text-[#94A0B2]">
                      Enter the 6-digit verification code
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleOtpSubmit}
                    className="
                      login-button
                      mt-5
                      h-12
                      w-full
                      rounded-xl
                      !bg-[#50589C]
                      text-sm
                      font-semibold
                      text-white
                      !shadow-[0_8px_22px_rgba(80,88,156,.22)]
                      hover:!bg-[#454D8C]
                    "
                  >
                    <span className="flex items-center justify-center gap-2">
                      Verify & Continue
                      <FaArrowRight className="text-xs" />
                    </span>
                  </Button>

                  <button
                    type="button"
                    className="
                      mt-4
                      w-full
                      text-center
                      text-xs
                      font-semibold
                      text-[#50589C]
                      transition-colors
                      hover:text-[#303866]
                    "
                    onClick={() => {
                      setIsOtpSent(false);
                      setIsLoading(false);
                      setOtp("");
                    }}
                  >
                    Try a different{" "}
                    {loginMethod === "otp" ? "phone number" : "email"}
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Status */}
            <div className="mt-5 flex items-center justify-center gap-5 text-[10px] font-medium text-[#94A0B2]">
              <span className="flex items-center gap-1.5">
                <FiShield className="text-[#50589C]" />
                Protected
              </span>

              <span className="h-3 w-px bg-[#DCE1EB]" />

              <span className="flex items-center gap-1.5">
                <FiActivity className="text-[#50589C]" />
                Admin Portal
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT VIDEO SECTION
        ====================================================== */}
        <div
          className="
            relative
            hidden
            h-screen
            w-1/2
            p-5
            lg:block
            xl:p-6
          "
        >
          <div
            className="
              login-video-animation
              login-video-card
              relative
              h-full
              overflow-hidden
              rounded-[30px]
              border
              border-white/30
              bg-[#50589C]
            "
          >
            {/* Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
              "
            >
              <source src={loginvideo} type="video/mp4" />
            </video>

            {/* Main Overlay */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#29315F]/90
                via-[#50589C]/20
                to-[#50589C]/5
              "
            />

            {/* Glow */}
            <div
              className="
                login-pulse
                absolute
                -right-20
                -top-20
                h-64
                w-64
                rounded-full
                bg-[#7DD3FC]/20
                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-24
                -left-20
                h-72
                w-72
                rounded-full
                bg-[#A5B4FC]/20
                blur-3xl
              "
            />

            {/* Top Badge */}
            <div
              className="
                absolute
                left-7
                right-7
                top-7
                flex
                items-center
                justify-between
              "
            >
              <div
                className="
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-4
                  py-2
                  text-[11px]
                  font-semibold
                  tracking-wide
                  text-white
                  backdrop-blur-xl
                "
              >
                FIXORA • ADMIN
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-3
                  py-2
                  text-[10px]
                  font-medium
                  text-white/90
                  backdrop-blur-xl
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#86EFAC]" />
                Live
              </div>
            </div>

            {/* Bottom Content */}
            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                p-7
                sm:p-9
              "
            >
              {/* Feature Pills */}
              <div className="mb-5 flex flex-wrap gap-2">
                <div
                  className="
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    px-3
                    py-1.5
                    text-[10px]
                    font-medium
                    text-white/90
                    backdrop-blur-md
                  "
                >
                  Service Management
                </div>

                <div
                  className="
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    px-3
                    py-1.5
                    text-[10px]
                    font-medium
                    text-white/90
                    backdrop-blur-md
                  "
                >
                  Smart Operations
                </div>
              </div>

              <h2
                className="
                  max-w-[560px]
                  text-3xl
                  font-bold
                  leading-tight
                  tracking-[-.025em]
                  text-white
                  xl:text-4xl
                "
              >
                Everything your service team needs,
                <span className="text-[#C7D2FE]">
                  {" "}
                  in one place.
                </span>
              </h2>

              <p
                className="
                  mt-3
                  max-w-[510px]
                  text-sm
                  leading-6
                  text-white/70
                "
              >
                Manage customers, service requests, payments and daily
                operations through a clean and powerful admin workspace.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/15
                    bg-white/10
                    text-white
                    backdrop-blur-md
                  "
                >
                  <FiActivity />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Your operations, simplified
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/55">
                    Secure • Fast • Reliable
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;