import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import Error from "@/components/form/others/Error";
import logo from "@/assets/img/logo/logo.png";
import { notifySuccess } from "@/utils/toast";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const review = REVIEWS[reviewIndex];

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      notifySuccess("Account created. You can sign in now.");
    }, 400);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#211e27]/20" />
        <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/25 bg-white/20 p-6 backdrop-blur-md">
          <p className="text-xl font-medium leading-relaxed text-white">
            “{review.quote}”
          </p>
          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <p className="font-semibold text-white">{review.name}</p>
              <p className="text-sm text-white/80">{review.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5 text-white">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className="h-3.5 w-3.5" />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setReviewIndex(
                      (prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white"
                >
                  <FiChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setReviewIndex((prev) => (prev + 1) % REVIEWS.length)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-[400px] text-center">
          <img src={logo} alt="Fixora" className="mx-auto mb-6 h-10 object-contain" />
          <h1 className="text-3xl font-semibold text-[#211e27]">Sign up</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Create your Fixora account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 text-left">
            <label className="text-sm font-medium text-[#211e27]">Name</label>
            <input
              className="mt-1.5 mb-1 h-11 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#50589C]"
              placeholder="Enter your name"
              {...register("name", { required: "Name is required" })}
            />
            <Error errorName={errors.name} />

            <label className="mt-3 block text-sm font-medium text-[#211e27]">
              Email
            </label>
            <input
              type="email"
              className="mt-1.5 mb-1 h-11 w-full rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#50589C]"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
            />
            <Error errorName={errors.email} />

            <label className="mt-3 block text-sm font-medium text-[#211e27]">
              Role
            </label>
            <select
              className="mt-1.5 mb-1 h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm outline-none focus:border-[#50589C]"
              {...register("role", { required: "Role is required" })}
            >
              <option value="">Select your role</option>
              <option value="Customer">Customer</option>
              <option value="Service Professional">Service Professional</option>
              <option value="Admin">Admin / Manager</option>
            </select>
            <Error errorName={errors.role} />

            <label className="mt-3 block text-sm font-medium text-[#211e27]">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                className="mb-1 h-11 w-full rounded-lg border border-[#E2E8F0] px-3 pr-10 text-sm outline-none focus:border-[#50589C]"
                placeholder="Create a password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters",
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <p className="mb-1 text-xs text-[#A3AED0]">
              Must be at least 8 characters.
            </p>
            <Error errorName={errors.password} />

            <button
              type="submit"
              disabled={loading}
              className="mt-5 h-12 w-full rounded-lg bg-[#211e27] text-sm font-medium text-white"
            >
              {loading ? "Please wait..." : "Get started"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => notifySuccess("Google sign up is UI-only for now.")}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#211e27]"
          >
            <FaGoogle /> Sign up with Google
          </button>

          <p className="mt-6 text-sm text-[#6B7280]">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[#50589C] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
