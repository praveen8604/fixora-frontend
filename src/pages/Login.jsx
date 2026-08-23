import React, { useContext, useEffect, useState } from "react";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
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
  const maskedNumber = enteredMobileNumber?.replace(/\d(?=\d{4})/g, "*");
  const maskedEmail = enteredEmail?.replace(
    /^(.)(.*)(.@.*)$/,
    (match, firstChar, middleChars, domain) =>
      firstChar + middleChars.replace(/./g, "*") + domain
  );
  const [userCountry, setUserCountry] = useState("in");

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => setUserCountry(data.country_code.toLowerCase()))
      .catch(() => setUserCountry("in"));
  }, []);

  const handlePhoneChange = (value, country) => {
    const dialCode = country?.dialCode || "";
    const nationalNumber = value.startsWith(dialCode)
      ? value.slice(dialCode.length)
      : value;

    setValue("countryCode", `+${dialCode}`);
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

    dispatch({ type: "USER_LOGIN", payload: adminPayload });
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
      goToDashboard(data);
    } catch (error) {
      setIsLoading(false);
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

  return (
    <div className="relative flex min-h-screen h-screen overflow-hidden bg-[#F3F6FB]">
      <span className="login-orb login-orb-one z-0" />
      <span className="login-orb login-orb-three z-0" />

      <div className="relative z-10 flex w-full items-center justify-center overflow-y-auto px-6 py-10 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-[420px] dash-enter">
          <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 shadow-[0_8px_24px_rgba(80,88,156,0.08)]">
            <img src={logo} alt="Fixora" className="h-10 object-contain" />
          </div>
          <p className="mb-2 flex items-center gap-2 text-[12px] font-medium text-[#50589C]">
            <span className="dash-live" />
            Operations console
          </p>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#1B2559]">
            {!isOtpSent ? "Welcome back" : "Check your inbox"}
          </h1>
          <p className="mt-2 mb-8 text-sm text-[#64748B]">
            {!isOtpSent
              ? "Sign in with mobile or email to continue"
              : "Enter the 6-digit code to finish signing in"}
          </p>

          {!isOtpSent ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-[#F4F7FE] p-1">
                <button
                  type="button"
                  onClick={() => setLoginMethod("otp")}
                  className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-medium transition-all ${loginMethod === "otp"
                      ? "bg-white text-[#0EA5E9] shadow-[0_1px_4px_rgba(14,165,233,0.16)]"
                      : "text-[#64748B] hover:text-[#1B2559]"
                    }`}
                >
                  <FaPhoneAlt className="h-3.5 w-3.5" />
                  Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("email")}
                  className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2.5 text-sm font-medium transition-all ${loginMethod === "email"
                      ? "bg-white text-[#7C3AED] shadow-[0_1px_4px_rgba(124,58,237,0.16)]"
                      : "text-[#64748B] hover:text-[#1B2559]"
                    }`}
                >
                  <IoMdMail className="h-4 w-4" />
                  Email
                </button>
              </div>

              {loginMethod === "otp" ? (
                <div className="login-field">
                  <label className="mb-2 block text-sm font-medium text-[#1B2559]">
                    Mobile number
                  </label>
                  <PhoneInput
                    country={userCountry}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: "phone",
                      required: true,
                    }}
                    containerClass="text-left"
                    inputClass="!w-full !h-11 !rounded-xl !border-[#E6EAF0] !text-[#1B2559] !placeholder-[#94A3B8]"
                    buttonClass="!bg-[#F4F7FE] !border-[#E6EAF0] !rounded-l-xl"
                    dropdownClass="!bg-white !text-[#1B2559]"
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
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1B2559]">
                    Email
                  </label>
                  <div className="flex items-center overflow-hidden rounded-xl border border-[#E6EAF0] bg-white focus-within:border-[#7C3AED]">
                    <div className="flex h-11 w-11 items-center justify-center bg-[#F3E8FF] text-[#7C3AED]">
                      <IoMdMail className="text-lg" />
                    </div>
                    <input
                      placeholder="Enter your email"
                      className="h-11 w-full border-0 bg-transparent px-3 text-sm text-[#1B2559] placeholder-[#94A3B8] outline-none"
                      {...register("email", {
                        required:
                          loginMethod === "email"
                            ? "Please enter your Email"
                            : false,
                      })}
                    />
                  </div>
                </div>
              )}
              <Error errorName={errors.countryCode} />
              <Error errorName={errors.phoneNumber} />
              <Error errorName={errors.email} />

              <Button
                type="submit"
                className="mt-5 h-12 w-full rounded-xl !bg-[#50589C] text-white hover:!bg-[#434a86]"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Continue"}
              </Button>
              <p className="mt-5 text-sm text-[#64748B]">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#50589C] hover:text-[#1B2559]"
                >
                  Sign up
                </Link>
              </p>
            </form>
          ) : (
            <div>
              <p className="mb-4 text-sm text-[#64748B]">
                {loginMethod === "otp"
                  ? `Enter the OTP sent to ${maskedNumber}.`
                  : `Enter the OTP sent to ${maskedEmail}.`}
                <span className="text-[#E11D48]"> *</span>
              </p>

              <input
                type="text"
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-4 h-12 w-full rounded-xl border border-[#E6EAF0] bg-white px-4 text-center text-lg tracking-[0.4em] text-[#1B2559] outline-none focus:border-[#50589C]"
                maxLength={6}
              />
              <Button
                onClick={handleOtpSubmit}
                className="h-12 w-full rounded-xl !bg-[#50589C] text-white hover:!bg-[#434a86]"
              >
                Submit OTP
              </Button>
              <button
                type="button"
                className="mt-4 w-full text-left text-sm text-[#50589C] hover:text-[#1B2559]"
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
      </div>

      <div className="relative hidden h-screen p-5 lg:block lg:w-1/2">
        <div className="kpi-shine-card h-full">
          <div className="kpi-shine-inner relative h-full overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={loginvideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B2559]/70 via-[#1B2559]/10 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-sm font-medium text-white/80">Fixora</p>
              <p className="mt-2 text-2xl font-semibold leading-snug text-white">
                Run service operations from one quiet, modern console.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
