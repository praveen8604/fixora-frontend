import { Avatar, Badge, WindmillContext } from "@windmill/react-ui";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { FiTrash2, FiGrid, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import ellipse from "@/assets/img/icons/ellipse.svg";
import { AdminContext } from "@/context/AdminContext";
import useNotification from "@/hooks/useNotification";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import NotFoundTwo from "@/components/table/NotFoundTwo";
import NotificationServices from "@/services/NotificationServices";
import AlertDialog from "../common/AlterDialogBox";

const Header = () => {
  const { state, dispatch } = useContext(AdminContext);
  const { adminInfo } = state;
  const pRef = useRef();
  const nRef = useRef();
  const { t } = useTranslation();
  const { updated, setUpdated } = useNotification();
  const { showDateTimeFormat } = useUtilsFunction();

  const [data, setData] = useState([]);
  const [totalDoc, setTotalDoc] = useState(0);
  const [totalUnreadDoc, setTotalUnreadDoc] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // console.log("currentLanguageCode", currentLanguageCode);

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
    window.location.replace(`${import.meta.env.VITE_APP_ADMIN_DOMAIN}/login`);
  };

  const handleNotificationOpen = async () => {
    setNotificationOpen(!notificationOpen);
    setProfileOpen(false);
    await handleGetAllNotifications();
  };
  const handleProfileOpen = () => {
    setProfileOpen(!profileOpen);
    setNotificationOpen(false);
  };

  // handle notification status change
  const handleNotificationStatusChange = async (id) => {
    try {
      await NotificationServices.updateStatusNotification(id, {
        status: "read",
      });

      const getAllRes = await NotificationServices.getAllNotification();
      setData(getAllRes?.notifications);
      setTotalUnreadDoc(getAllRes?.totalUnreadDoc);
      window.location.reload(false);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  // handle notification delete
  const handleNotificationDelete = async (id) => {
    try {
      await NotificationServices.deleteNotification(id);
      const getAllRes = await NotificationServices.getAllNotification();
      setData(getAllRes?.notifications);
      setTotalUnreadDoc(getAllRes?.totalUnreadDoc);
      setTotalDoc(getAllRes?.totalDoc);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  //handle get notifications
  const handleGetAllNotifications = async () => {
    try {
      const res = await NotificationServices.getAllNotification();
      // console.log("notifcation api called", res);
      setData(res?.notifications);
      setTotalUnreadDoc(res?.totalUnreadDoc);
      setTotalDoc(res?.totalDoc);
      setUpdated(false);
    } catch (err) {
      setUpdated(false);
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!pRef?.current?.contains(e.target)) {
        setProfileOpen(false);
      }
      if (!nRef?.current?.contains(e.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [pRef, nRef]);

  // notification api calling
  useEffect(() => {
    // handleGetAllNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updated]);
  // const onChange = (event) => {
  //     i18next.changeLanguage(event.target.value);

  // }

  // console.log("notificaiotn", data);
  return (
    <>
      <header className="z-30 py-4 bg-[var(--primary-color)] backdrop-blur-lg shadow-sm">
        <div className="container flex items-center justify-end h-full mx-auto">
          <ul className="flex justify-end items-center">
            {/* <!-- Profile menu --> */}
            <li className="relative inline-block text-left" ref={pRef}>
              <button
                className="rounded-full dark:bg-gray-500 bg-[#211e27] text-white h-8 w-8 font-medium mx-auto focus:outline-none"
                onClick={handleProfileOpen}
              >
                {adminInfo?.image ? (
                  <Avatar
                    className="align-middle"
                    src={adminInfo.image}
                    aria-hidden="true"
                  />
                ) : (
                  <span>
                    {adminInfo?.email ? adminInfo.email[0].toUpperCase() : "A"}
                  </span>
                )}
              </button>

              {profileOpen && (
                <ul className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[var(--primary-color)] focus:outline-none">
                  <li className="justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                    <Link to="/dashboard">
                      <span className="flex items-center text-sm">
                        <FiGrid className="w-4 h-4 mr-3" aria-hidden="true" />
                        <span>{t("Dashboard")}</span>
                      </span>
                    </Link>
                  </li>

                  {/* <li className="justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                    <Link to="/edit-profile">
                      <span className="flex items-center text-sm">
                        <FiSettings
                          className="w-4 h-4 mr-3"
                          aria-hidden="true"
                        />
                        <span>{t("EditProfile")}</span>
                      </span>
                    </Link>
                  </li> */}
                  <AlertDialog
                    onClickInsider={() => setProfileOpen(true)}
                    onAgree={() => handleLogOut()}
                    dialogTitle={"Logout?"}
                    dialogDetails={"Are you sure you want to logout?"}
                    AgreeButtonValue="Yes, Logout!"
                    CancelButton="Cancel"
                    triggerButton={(onClickFunc) => {
                      return (
                        <li
                          onClick={onClickFunc}
                          className="cursor-pointer justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        >
                          <span className="flex items-center text-sm">
                            <FiLogOut
                              className="w-4 h-4 mr-3"
                              aria-hidden="true"
                            />
                            <span>{t("LogOut")}</span>
                          </span>
                        </li>
                      );
                    }}
                  />
                </ul>
              )}
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
