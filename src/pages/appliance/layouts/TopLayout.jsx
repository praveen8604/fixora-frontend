import { useState, useEffect } from "react";
import { notifySuccess } from "@/utils/toast";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useHistory } from "react-router-dom";
import { getDeviceImage } from "@/pages/Appliance";

const TopLayout = ({ applianceData, appData }) => {
  const history = useHistory();
  const [timer, setTimer] = useState(20); // Initialize the timer at 20 seconds
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleNotifyUser = () => {
    notifySuccess("Notification sent successfully!");
    startTimer(); // Start the countdown when the notification is sent
  };

  const startTimer = () => {
    setIsButtonDisabled(true); // Disable the button when the countdown starts
    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown); // Stop the countdown when it reaches 0
          setIsButtonDisabled(false); // Re-enable the button
          setTimer(20); // Reset the timer
          return 20; // Reset the time
        }
        return prevTime - 1;
      });
    }, 1000); // Update the timer every second
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#E4E8ED] bg-white p-6 shadow-[0_3px_12px_rgba(30,40,55,0.035)]">
      <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-[#7C8592]">
        <div
          className="cursor-pointer transition hover:text-[#20242B]"
          onClick={() => history.push("/Appliance")}
        >
          Appliances
        </div>
        <div className="text-[#A0A7B1]">
          <IoIosArrowForward />
        </div>
        <div className="rounded-full bg-[#F4F6F8] px-3 py-1.5 text-xs text-[#59626E]">
          {applianceData?._id || "Device"}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[28px] border border-[#E4E8ED] bg-[#F4F6F8] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
          <img
            src={appData?.model?.attachment || getDeviceImage(appData)}
            alt={applianceData?.modelId}
            className="h-[90px] w-[90px] object-contain"
          />
        </div>
        <div>
          <div className="text-lg font-extrabold tracking-[-0.02em] text-[#20242B]">
            {appData?.model?.modelName} - {appData?.model?.modelId}
          </div>
          <div className="mt-1 text-sm font-semibold text-[#7C8592]">
            {appData?.appliance?.applianceName}
          </div>
        </div>

        <div className="lg:ml-auto">
          <button
            type="button"
            className="inline-flex items-center rounded-xl bg-[#20242B] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#111827] focus:outline-none focus:ring-4 focus:ring-[#D7DCE5]"
            onClick={handleNotifyUser}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? `Sent (${timer}s)` : "Notify User"}
            {!isButtonDisabled && (
              <svg
                className="ms-2 h-3.5 w-3.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopLayout;
