import React, { useContext, useEffect, useState } from "react";
import { IoMdMail } from "react-icons/io";
import { Button } from "@windmill/react-ui";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm } from "react-hook-form";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import Error from "@/components/form/others/Error";
import LabelArea from "@/components/form/selectOption/LabelArea";
import loginvideo from "@/assets/img/loginvideo.mp4";
import logo from "@/assets/img/logo/logo.png";
import { DecryptData } from "@/utils/DecryptData";
import { AdminContext } from "@/context/AdminContext";
import { removeSetting } from "@/reduxStore/slice/settingSlice";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

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
    const extractedCountryCode = `+${country.dialCode}`;
    const extractedMobileNumber = value
      .replace(extractedCountryCode, "")
      .trim();

    setValue("countryCode", extractedCountryCode);
    setValue(
      "phoneNumber",
      extractedMobileNumber.slice(extractedCountryCode.split("").length - 1)
    );
  };

  const onSubmit = (data) => {
    try {
      setIsLoading(true);
      reduxDispatch(removeSetting("globalSetting"));

      AdminServices.loginOTPAdmin({
        ...(loginMethod === "otp"
          ? {
              phoneNumber: data.phoneNumber,
              countryCode: data.countryCode,
              isAuthServiceFor: "login",
            }
          : { email: data.email, isAuthServiceFor: "login" }),
      })
        .then((res) => {
          if (res) {
            setIsOtpSent(true);
            setEnteredEmail(data.email);
            setEnteredMobileNumber(data.phoneNumber);
            setEnteredCountryCode(data.countryCode);
            notifySuccess("Please enter the OTP sent to your phone.");
            const decodedata = DecryptData(res);
            console.log("DecryptData", decodedata);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          const decoded = DecryptData(err?.response?.data);
          notifyError(decoded?.error?.message || "Unable to send OTP.");
        });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = () => {
    if (otp.length === 6) {
      AdminServices.loginAdmin({
        secretCodeClient: otp,
        ...(loginMethod === "otp"
          ? {
              phoneNumber: enteredMobileNumber,
              countryCode: enteredCountryCode,
            }
          : { email: enteredEmail }),
        deviceId: "s89auja98suda98sud--as90ajs",
        verificationMethod: loginMethod,
        isLoginFor: "admin-panel",
      })
        .then((res) => {
          notifySuccess("Login Success!");
          const decodedata = DecryptData(res);
          const adminPayload = {
            _id: decodedata?.data?.user?._id,
            userName: decodedata?.data?.user?.userName,
            email: decodedata?.data?.user?.email,
            phoneNumber: decodedata?.data?.user?.phoneNumber,
            countryCode: decodedata?.data?.user?.countryCode,
            role: decodedata?.data?.user?.role,
            createdAt: decodedata?.data?.user?.createdAt,
          };
          dispatch({ type: "USER_LOGIN", payload: decodedata });
          localStorage.setItem("theme", "light");
          Cookies.set("adminInfo", JSON.stringify(adminPayload), {
            expires: cookieTimeOut,
            sameSite: "None",
            secure: true,
          });
          Cookies.set("token", JSON.stringify(decodedata?.data.jwt_token), {
            expires: cookieTimeOut,
            sameSite: "None",
            secure: true,
          });
          window.location.replace("/dashboard");
        })
        .catch((err) => {
          const decodedata = DecryptData(err?.response?.data);
          notifyError(decodedata?.error?.message);
        });
    } else {
      notifyError("Please enter a valid 6-digit OTP.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src={loginvideo} type="video/mp4" />
      </video>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-lg bg-[#12121280] p-8 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2">
            <img src={logo} alt="Fixora" className="h-10 object-contain" />
          </div>
          <h1 className="mb-6 text-2xl font-semibold text-white">
            {!isOtpSent ? "Sign in" : "Enter OTP"}
          </h1>

          {!isOtpSent ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              {loginMethod === "otp" ? (
                <div>
                  <LabelArea
                    label={<span className="text-white">Mobile Number</span>}
                  />
                  <PhoneInput
                    country={userCountry}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: "phone",
                      required: true,
                    }}
                    containerClass="mt-4 text-left"
                    inputClass="!w-full !rounded-md !border-gray-300 !text-black !placeholder-gray-500"
                    buttonClass="!bg-gray-100 !border-gray-300"
                    dropdownClass="!bg-white !text-black"
                  />
                  <input type="hidden" />
                  <input
                    {...register("phoneNumber", {
                      required: "Please enter your Phone number",
                    })}
                    type="hidden"
                  />
                </div>
              ) : (
                <div>
                  <LabelArea
                    label={<span className="text-white">Email Id</span>}
                  />
                  <div className="mt-4 flex items-center">
                    <div className="flex h-[35px] w-[45px] items-center justify-center rounded-s-md bg-white border-r border-[#d4d4d4]">
                      <IoMdMail className="text-lg" />
                    </div>
                    <input
                      placeholder="Enter your email id"
                      className="h-[35px] w-full rounded-e-md border-gray-300 ps-2 text-sm text-black placeholder-gray-500 outline-none"
                      {...register("email", {
                        required: "Please enter your Email",
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
                className="mt-4 h-12 w-full !bg-[#1f2937]"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
              </Button>
              <div className="mt-4 flex flex-col items-center gap-2 text-sm text-white">
                <div>Or</div>
                {loginMethod === "otp" ? (
                  <div
                    className="cursor-pointer underline hover:text-gray-300"
                    onClick={() => setLoginMethod("email")}
                  >
                    Login with email
                  </div>
                ) : (
                  <div
                    className="cursor-pointer underline hover:text-gray-300"
                    onClick={() => setLoginMethod("otp")}
                  >
                    Login with OTP
                  </div>
                )}
              </div>
            </form>
          ) : (
            <div>
              <h2 className="mb-4 text-white">
                {loginMethod === "otp"
                  ? `Enter the OTP sent to your ${maskedNumber} number.`
                  : `Enter the OTP sent to the mail ${maskedEmail}`}{" "}
                <span className="text-red-600"> *</span>
              </h2>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-4 w-full rounded border p-3 text-black"
                maxLength={6}
              />
              <Button
                onClick={handleOtpSubmit}
                className="h-12 w-full !bg-[#1f2937]"
              >
                Submit OTP
              </Button>
              <div className="mt-3 text-center text-sm text-white">Or</div>
              <div
                className="mt-3 cursor-pointer text-center text-sm text-white underline hover:text-gray-300"
                onClick={() => {
                  setIsOtpSent(false);
                  setIsLoading(false);
                  setOtp("");
                }}
              >
                Try different{" "}
                {loginMethod === "otp" ? "Phone Number" : "Email"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
