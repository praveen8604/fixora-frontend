import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  FiEye,
  FiEyeOff,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { FaGoogle, FaStar } from "react-icons/fa";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import Error from "@/components/form/others/Error";
import logo from "@/assets/img/logo/logo.png";
import { notifySuccess } from "@/utils/toast";
import AdminServices from "@/services/AdminServices";

const REVIEWS = [
  {
    quote:
      "Fixora made booking home repairs simple. We track every request in one place and the team actually shows up on time.",
    name: "Caitlyn King",
    title: "Homeowner, Bengaluru",
  },
  {
    quote:
      "As a technician I get jobs, addresses, and payments without chasing calls. It has changed how I work every day.",
    name: "Arjun Mehta",
    title: "Service Professional, Pune",
  },
  {
    quote:
      "We run our service operations on Fixora. Dispatch, status, and customer updates finally live in one dashboard.",
    name: "Priya Shah",
    title: "Operations Manager, Mumbai",
  },
];

const SignUp = () => {
  const history = useHistory();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const review = REVIEWS[reviewIndex];

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
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const payload = {
        userName: formData.name,
        secretCodeClient: "000000",
        deviceId: `web-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 10)}`,
        addressInput:
          formData.addressInput || "madubani",
        countryCode: formData.countryCode,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        verificationMethod: "otp",
        email: formData.email,
      };

      console.log("REGISTER PAYLOAD:", payload);

      const response =
        await AdminServices.registerAdmin(payload);

      console.log("REGISTER RESPONSE:", response);

      notifySuccess(
        response?.message ||
          "Account created successfully.",
      );

      history.push("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Registration failed. Please try again.";

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          /* =====================================================
             SIGNUP PAGE
             Only layout/plugin styling is kept here.
             Theme colors come from Tailwind classes.
          ===================================================== */

          .fm-signup-phone {
            position: relative;
            width: 100%;
            height: 44px;
            overflow: hidden;
            border-radius: 8px;
            box-sizing: border-box;
          }

          .fm-signup-phone .react-tel-input {
            width: 100%;
            height: 44px;
          }

          .fm-signup-phone .form-control {
            width: 100% !important;
            height: 44px !important;
            padding-left: 52px !important;
            padding-right: 12px !important;
            border: 0 !important;
            outline: none !important;
            background: transparent !important;
            font-size: 14px !important;
            box-sizing: border-box !important;
          }

          .fm-signup-phone .flag-dropdown {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 48px !important;
            height: 42px !important;
            border: 0 !important;
            border-right: 1px solid !important;
            border-radius: 8px 0 0 8px !important;
            z-index: 5 !important;
          }

          .fm-signup-phone .selected-flag {
            width: 48px !important;
            height: 42px !important;
            padding-left: 12px !important;
            border-radius: 8px 0 0 8px !important;
          }

          .fm-signup-phone .selected-flag:hover,
          .fm-signup-phone .selected-flag:focus {
            background: transparent !important;
          }

          .fm-signup-phone .country-list {
            width: 300px !important;
            max-width: calc(100vw - 40px) !important;
            border-radius: 8px !important;
            border: 1px solid !important;
            box-shadow:
              0 12px 25px rgba(15, 23, 42, 0.12) !important;
            z-index: 20 !important;
          }

          .fm-signup-phone .country-list .country:hover {
            background: transparent !important;
          }

          .fm-signup-phone .country-list .country.highlight {
            background: transparent !important;
          }

          @media (max-width: 1023px) {
            .fm-signup-left {
              display: none;
            }
          }
        `}
      </style>

      <div
        className="
          flex
          min-h-screen
          w-full
          bg-background
        "
      >
        {/* =====================================================
            LEFT IMAGE / REVIEWS
        ===================================================== */}

        <div
          className="
            fm-signup-left
            relative
            hidden
            w-1/2
            overflow-hidden
            lg:block
          "
        >
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />

          {/* Theme overlay */}
          <div
            className="
              absolute
              inset-0
              bg-primary/30
            "
          />

          {/* Review Card */}
          <div
            className="
              absolute
              bottom-8
              left-8
              right-8
              rounded-2xl
              border
              border-accent/60
              bg-primary/70
              p-6
              backdrop-blur-md
            "
          >
            <p
              className="
                text-xl
                font-medium
                leading-relaxed
                text-white
              "
            >
              “{review.quote}”
            </p>

            <div
              className="
                mt-6
                flex
                items-end
                justify-between
                gap-4
              "
            >
              {/* Review Author */}
              <div>
                <p className="font-semibold text-white">
                  {review.name}
                </p>

                <p className="text-sm text-white/80">
                  {review.title}
                </p>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                {/* Stars */}
                <div
                  className="
                    flex
                    gap-0.5
                    text-accent
                  "
                >
                  {Array.from({
                    length: 5,
                  }).map((_, i) => (
                    <FaStar
                      key={i}
                      className="
                        h-3.5
                        w-3.5
                      "
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setReviewIndex(
                        (prev) =>
                          (prev -
                            1 +
                            REVIEWS.length) %
                          REVIEWS.length,
                      )
                    }
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-accent/70
                      text-white
                      transition
                      hover:bg-secondary
                    "
                  >
                    <FiChevronLeft />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setReviewIndex(
                        (prev) =>
                          (prev + 1) %
                          REVIEWS.length,
                      )
                    }
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-accent/70
                      text-white
                      transition
                      hover:bg-secondary
                    "
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT SIGNUP AREA
        ===================================================== */}

        <div
          className="
            flex
            w-full
            items-center
            justify-center
            bg-background
            px-5
            py-8
            sm:px-6
            lg:w-1/2
          "
        >
          <div
            className="
              w-full
              max-w-[400px]
              text-center
            "
          >
            {/* Logo */}
            <img
              src={logo}
              alt="Fixora"
              className="
                mx-auto
                mb-5
                h-10
                object-contain
              "
            />

            {/* Heading */}
            <h1
              className="
                text-3xl
                font-semibold
                text-primary
              "
            >
              Sign up
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-secondary
              "
            >
              Create your Fixora account
            </p>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="
                mt-7
                text-left
              "
            >
              {/* Name */}
              <label
                className="
                  text-sm
                  font-medium
                  text-primary
                "
              >
                Name
              </label>

              <input
                className="
                  mt-1.5
                  mb-1
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-accent
                  bg-white
                  px-3
                  text-sm
                  text-primary
                  outline-none
                  placeholder:text-secondary
                  placeholder:opacity-60
                  focus:border-primary
                  focus:ring-1
                  focus:ring-primary/20
                "
                placeholder="Enter your name"
                {...register("name", {
                  required:
                    "Name is required",
                })}
              />

              <Error
                errorName={errors.name}
              />

              {/* Phone Number */}
              <label
                className="
                  mt-3
                  block
                  text-sm
                  font-medium
                  text-primary
                "
              >
                Phone Number
              </label>

              <div
                className="
                  fm-signup-phone
                  mt-1.5
                  mb-1
                  border
                  border-accent
                  bg-white
                  focus-within:border-primary
                "
              >
                <PhoneInput
                  country="in"
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: "phone",
                    required: true,
                  }}
                  containerClass="!w-full"
                  inputClass="
                    !w-full
                    !h-11
                    !rounded-none
                    !border-0
                    !bg-transparent
                    !text-primary
                  "
                  buttonClass="
                    !bg-accent
                    !border-accent
                    !border-r
                    !rounded-none
                  "
                />
              </div>

              <input
                type="hidden"
                {...register(
                  "phoneNumber",
                  {
                    required:
                      "Phone number is required",
                  },
                )}
              />

              <input
                type="hidden"
                {...register(
                  "countryCode",
                  {
                    required:
                      "Country code is required",
                  },
                )}
              />

              <Error
                errorName={
                  errors.phoneNumber
                }
              />

              {/* Email */}
              <label
                className="
                  mt-3
                  block
                  text-sm
                  font-medium
                  text-primary
                "
              >
                Email
              </label>

              <input
                type="email"
                className="
                  mt-1.5
                  mb-1
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-accent
                  bg-white
                  px-3
                  text-sm
                  text-primary
                  outline-none
                  placeholder:text-secondary
                  placeholder:opacity-60
                  focus:border-primary
                  focus:ring-1
                  focus:ring-primary/20
                "
                placeholder="Enter your email"
                {...register("email", {
                  required:
                    "Email is required",
                })}
              />

              <Error
                errorName={errors.email}
              />

              {/* Role */}
              <label
                className="
                  mt-3
                  block
                  text-sm
                  font-medium
                  text-primary
                "
              >
                Role
              </label>

              <select
                className="
                  mt-1.5
                  mb-1
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-accent
                  bg-white
                  px-3
                  text-sm
                  text-primary
                  outline-none
                  focus:border-primary
                  focus:ring-1
                  focus:ring-primary/20
                "
                {...register("role", {
                  required:
                    "Role is required",
                })}
              >
                <option value="">
                  Select your role
                </option>

                <option value="customer">
                  Customer
                </option>

                <option value="technician">
                  Service Professional
                </option>

                <option value="admin">
                  Admin / Manager
                </option>
              </select>

              <Error
                errorName={errors.role}
              />

              {/* Password */}
              <label
                className="
                  mt-3
                  block
                  text-sm
                  font-medium
                  text-primary
                "
              >
                Password
              </label>

              <div className="relative mt-1.5">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="
                    mb-1
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-accent
                    bg-white
                    px-3
                    pr-10
                    text-sm
                    text-primary
                    outline-none
                    placeholder:text-secondary
                    placeholder:opacity-60
                    focus:border-primary
                    focus:ring-1
                    focus:ring-primary/20
                  "
                  placeholder="Create a password"
                  {...register(
                    "password",
                    {
                      required:
                        "Password is required",
                      minLength: {
                        value: 8,
                        message:
                          "Must be at least 8 characters",
                      },
                    },
                  )}
                />

                <button
                  type="button"
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-secondary
                    transition
                    hover:text-primary
                  "
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev,
                    )
                  }
                >
                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>
              </div>

              <p
                className="
                  mb-1
                  text-xs
                  text-secondary
                "
              >
                Must be at least 8 characters.
              </p>

              <Error
                errorName={errors.password}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  mt-5
                  h-12
                  w-full
                  rounded-lg
                  bg-primary
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-secondary
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading
                  ? "Creating account..."
                  : "Get started"}
              </button>
            </form>

            {/* Google */}
            <button
              type="button"
              onClick={() =>
                notifySuccess(
                  "Google sign up is UI-only for now.",
                )
              }
              className="
                mt-3
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-accent
                bg-white
                text-sm
                font-medium
                text-primary
                transition
                hover:bg-accent
              "
            >
              <FaGoogle />
              Sign up with Google
            </button>

            {/* Login */}
            <p
              className="
                mt-6
                text-sm
                text-secondary
              "
            >
              Already have an account?{" "}

              <Link
                to="/login"
                className="
                  font-medium
                  text-primary
                  transition
                  hover:text-secondary
                  hover:underline
                "
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;