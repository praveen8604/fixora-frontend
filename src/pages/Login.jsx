import React, { useContext, useEffect, useState } from "react";
import { IoMdMail } from "react-icons/io";
import { Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm } from "react-hook-form";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import Error from "@/components/form/others/Error";
import LabelArea from "@/components/form/selectOption/LabelArea";
import loginvideo from "@/assets/img/loginvideo.mp4";
// import bglogin from "@/assets/img/bglogin.gif";
import { DecryptData } from "@/utils/DecryptData";
import { AdminContext } from "@/context/AdminContext";
import { removeSetting } from "@/reduxStore/slice/settingSlice";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

const Login = () => {
  const reduxDispatch = useDispatch();
  const { dispatch, state } = useContext(AdminContext);
  const { adminInfo } = state;
  const history = useHistory();
  const location = useLocation();

  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const cookieTimeOut = 0.5;
  const [loginMethod, setLoginMethod] = useState("otp");
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP screen state
  const [enteredEmail, setEnteredEmail] = useState(""); // Store the entered mobile number
  const [enteredMobileNumber, setEnteredMobileNumber] = useState(""); // Store the entered mobile number
  const [enteredCountryCode, setEnteredCountryCode] = useState(""); // Store the entered country code
  const [otp, setOtp] = useState(""); // Store OTP input value
  const [isLoading, setIsLoading] = useState(false);
  const maskedNumber = enteredMobileNumber?.replace(/\d(?=\d{4})/g, "*");
  const maskedEmail = enteredEmail?.replace(
    /^(.)(.*)(.@.*)$/,
    (match, firstChar, middleChars, domain) => {
      return firstChar + middleChars.replace(/./g, "*") + domain;
    }
  );
  const [userCountry, setUserCountry] = useState("in"); // Default country

  // Function to fetch the user's country code
  const fetchUserCountry = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/"); // You can use any geolocation API
      const data = await response.json();
      // console.log("country", data);
      setUserCountry(data.country_code.toLowerCase()); // Convert to lowercase for compatibility
    } catch (error) {
      console.error("Error fetching user's country:", error);
    }
  };

  useEffect(() => {
    fetchUserCountry();
  }, []);

  useEffect(() => {
    if (adminInfo?.email) {
      history.replace("/dashboard");
    }
  }, [adminInfo, history]);

  // Handle phone input changes
  const handlePhoneChange = (value, country) => {
    const extractedCountryCode = `+${country.dialCode}`;
    const extractedMobileNumber = value
      .replace(extractedCountryCode, "")
      .trim();

    // Update form values
    setValue("countryCode", extractedCountryCode);
    setValue(
      "phoneNumber",
      extractedMobileNumber.slice(extractedCountryCode.split("").length - 1)
    );
  };

  // On form submission (Login)
  const onSubmit = (data) => {
    try {
      setIsLoading(true); // Start loading
      reduxDispatch(removeSetting("globalSetting"));

      console.log("asdfh", data);
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
            // console.log("res", res);
            // Show OTP input form
            setIsOtpSent(true);
            setEnteredEmail(data.email); // Store mobile number for OTP
            setEnteredMobileNumber(data.phoneNumber); // Store mobile number for OTP
            setEnteredCountryCode(data.countryCode); // Store country code for OTP
            notifySuccess("Please enter the OTP sent to your phone.");
            const decodedata = DecryptData(res);
            console.log("DecryptData", decodedata);
          }
        })
        .catch((err) => {
          setIsLoading(false); // Start loading
          console.log("err?.response: ", err);
          
          const data = DecryptData(err?.response?.data);
          console.log("DecryptData", data);
          notifyError(data.error.message);
        });
    } catch (error) {
      setIsLoading(false); // false loading
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = () => {
    console.log("debugging-otp: ", otp?.length);

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
          // Handle successful OTP verification
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
    <div className="flex items-center min-h-screen p-6  dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden  rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <video
              autoPlay
              loop
              muted
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
            >
              <source src={loginvideo} type="video/mp4" />
            </video>
          </div>
          {/* <div className="w-screen h-screen overflow-hidden">
      <img
        src={bglogin}
        alt="Funny GIF"
        className="w-full h-full object-cover"
      />
    </div> */}
          <div class="relative mr-60 mt-40 flex items-center justify-center backdrop-blur-sm bg-[#242424c1] rounded-lg w-full h-full">
            <div class=" p-8 rounded-lg  w-full max-w-md">
              <h1 class="mb-6 text-2xl  items-center font-semibold text-white">
                {!isOtpSent ? "Login" : "Enter OTP"}
              </h1>

              {/* Show OTP input form if OTP has been sent */}
              {!isOtpSent ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  {loginMethod === "otp" ? (
                    <div>
                      <LabelArea
                        label={
                          <span className="text-white">Mobile Number</span>
                        }
                      />
                      <PhoneInput
                        country={userCountry}
                        onChange={handlePhoneChange}
                        inputProps={{
                          name: "phone",
                          required: true,
                        }}
                        containerClass="mt-4 "
                        inputClass="!w-full  !rounded-md !border-gray-300 !text-black !placeholder-gray-500"
                        buttonClass="!bg-gray-100 !border-gray-300"
                        dropdownClass="!bg-white !text-black"
                      />
                      {/* Hidden inputs for country code and mobile number */}
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
                      <div className="flex items-center mt-4">
                        <div className="h-[35px] w-[45px] rounded-e-none rounded-sm bg-white flex items-center justify-center border-r-[1px] border-[#d4d4d4]">
                          <IoMdMail className="text-lg" />
                        </div>
                        <input
                          placeholder="Enter your email id"
                          className="w-full rounded-s-none rounded-md border-gray-300 text-black placeholder-gray-500 h-[35px] text-sm placeholder:text-sm ps-2 outline-none"
                          {...register("email", {
                            required: "Please enter your Email",
                          })}
                        />
                      </div>
                    </div>
                  )}
                  {/* Error Handling */}
                  <Error errorName={errors.countryCode} />
                  <Error errorName={errors.phoneNumber} />
                  <Error errorName={errors.email} />

                  <Button
                    type="submit"
                    className="mt-4 h-12 w-full !bg-[#1f2937] hover:bg-blue-400"
                    disabled={isLoading} // Disable button during loading
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </Button>
                  <div className="flex flex-col items-center text-white gap-2 mt-4 text-sm">
                    <div className="">Or</div>
                    {loginMethod === "otp" ? (
                      <div
                        className="cursor-pointer underline hover:text-gray-300"
                        onClick={() => {
                          setLoginMethod("email");
                        }}
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
                // OTP Input UI
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
                    onChange={(e) => setOtp(e.target.value)} // Set OTP input value
                    className="w-full p-3 border rounded mb-4"
                    maxLength={6}
                  />
                  <Button
                    onClick={handleOtpSubmit}
                    className="h-12 w-full !bg-[#1f2937] hover:bg-blue-400"
                  >
                    Submit OTP
                  </Button>
                  <div className="text-white text-center text-sm mt-3">Or</div>
                  <div
                    className="text-white text-center text-sm mt-3 underline cursor-pointer hover:text-gray-300"
                    onClick={() => {
                      setIsOtpSent(false);
                      setIsLoading(false);
                      setEma;
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
      </div>
    </div>
  );
};
export default Login;
