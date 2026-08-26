import React, { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import ReactFlagsSelect from "react-flags-select";
import { useTranslation } from "react-i18next";
import { Select } from "@windmill/react-ui";
import { Button } from "@windmill/react-ui";

//internal import
import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import LabelArea from "@/components/form/selectOption/LabelArea";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import useLanguageSubmit from "@/hooks/useLanguageSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";
import SelectUserStatus from "../form/selectOption/SelectUserStatus";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import { notifySuccess } from "@/utils/toast";
import { useEffect } from "react";
import Dropdown from "../common/DropDown";

//internal import

const StaffDrawer = ({ id, toggleDrawer, handleCallBack, defaultStatus }) => {
  const [status, setStatus] = useState("");
  const [userStatusSelectedOption, setUserStatusSelectedOption] = useState("");
  const handleUserStatusSelect = (e) => {
    setUserStatusSelectedOption(e);
    setStatus(e === "not eligible" ? "not-eligible" : e);
  };
  const handleApproveUsers = (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    DashboardServices.practicingStatusUpdate({
      userId: id,
      isPracticingEligible: status,
    })
      .then((res) => {
        if (res) {
          console.log("res", res);
          handleCallBack && handleCallBack();
          notifySuccess("Approvable Success");
          toggleDrawer();
        }
      })
      .catch((err) => {
        console.log("err", err);
        // Optionally handle errors here
      });
  };
  const handletoggle = () => {
    toggleDrawer();
    setStatus("");
  };

  useEffect(() => {
    if (defaultStatus) {
      setStatus(defaultStatus);
      setUserStatusSelectedOption(
        defaultStatus === "not-eligible" ? "not eligible" : defaultStatus
      );
    } else {
      setStatus("pending");
    }
  }, [defaultStatus]);

  const { t } = useTranslation();

  return (
    <>
      <div className="w-full relative p-4 border-b border-gray-100 bg-gray-5">
        {id ? (
          <Title
            title={t("User Profile")}
            description={t("Change necessary information from here")}
          />
        ) : (
          <Title
            title={t("User Profile")}
            description={t("Change necessary information from here")}
          />
        )}
      </div>

      <Scrollbars className="w-full relative">
        <form onSubmit={handleApproveUsers}>
          <div className="p-4 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="mb-6 relative w-full">
              <div className="text-sm font-bold">User Status</div>
              <div className="w-full bg-white">
                {/* <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" defaultValue hidden>
                    User Approvable
                  </option>
                  <option value="pending" disabled>
                    Pending
                  </option>
                  <option value="eligible">Eligible</option>
                  <option value="not-eligible">Not Eligible</option>
                </Select> */}
                <Dropdown
                  containerClassname={"w-full"}
                  className={"cursor-pointer capitalize"}
                  dropdownClassName="capitalize"
                  value={userStatusSelectedOption}
                  placeholder="Select User Status!"
                  onSelect={handleUserStatusSelect}
                  options={["pending", "eligible", "not eligible"]}
                  disabled={false}
                />
                {/* <Error errorName={errors.userstatus} /> */}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 w-full py-4 px-6 grid gap-2 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              onClick={handletoggle}
              className="w-full h-12 bg-[var(--secondary-light-2-color)] text-[var(--primary-elite-color)] rounded-md text-sm"
            >
              {t("CancelBtn")}
            </button>
            <button
              type="submit"
              className="w-full h-12 bg-[var(--primary-elite-color)] text-[var(--primary-color)] rounded-md text-sm"
            >
              <span>Update Status</span>
            </button>
          </div>
        </form>
      </Scrollbars>
    </>
  );
};

export default StaffDrawer;
