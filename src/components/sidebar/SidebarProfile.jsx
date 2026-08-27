import { useContext, useState } from "react";
import Cookies from "js-cookie";
import { IoLogOutOutline } from "react-icons/io5";
import { AdminContext } from "@/context/AdminContext";
import AlertDialog from "../common/AlterDialogBox";

const SidebarProfile = () => {
  const { state, dispatch } = useContext(AdminContext);
  const { adminInfo } = state;

  const [hovered, setHovered] = useState(false);

  const name =
    adminInfo?.userName ||
    adminInfo?.name ||
    "Admin";

  const email = adminInfo?.email || "";

  const initial = (
    email ||
    name ||
    "A"
  )
    .charAt(0)
    .toUpperCase();

  const handleLogOut = () => {
    dispatch({
      type: "USER_LOGOUT",
    });

    Cookies.remove("adminInfo");
    Cookies.remove("token");

    const adminDomain =
      import.meta.env.VITE_APP_ADMIN_DOMAIN;

    window.location.replace(
      adminDomain
        ? `${adminDomain}/login`
        : "/login"
    );
  };

  return (
    <div
      className="
        absolute
        bottom-4
        left-0
        right-0
        flex
        justify-center
        px-2
      "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">

        {/* ==========================================
            PROFILE BUTTON
        =========================================== */}

        <button
          type="button"
          aria-label="Profile"
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            overflow-hidden
            rounded-full
            border-2
            border-[#E3CAA5]
            bg-[#AD8B73]
            text-sm
            font-bold
            text-white
            shadow-[0_5px_16px_rgba(173,139,115,0.20)]
            transition-all
            duration-200
            hover:border-[#CEAB93]
            hover:bg-[#CEAB93]
          "
        >
          {adminInfo?.image ? (
            <img
              src={adminInfo.image}
              alt={name}
              className="
                h-full
                w-full
                object-cover
              "
            />
          ) : (
            initial
          )}
        </button>

        {/* ==========================================
            PROFILE POPUP
        =========================================== */}

        {hovered && (
          <div
            className="
              absolute
              bottom-0
              left-full
              z-[80]
              pl-3
            "
          >
            <div
              className="
                w-[240px]
                rounded-2xl
                border
                border-[#E3CAA5]
                bg-[#FFFBE9]
                p-3
                shadow-[0_12px_32px_rgba(173,139,115,0.18)]
              "
            >
              {/* ======================================
                  PROFILE INFORMATION
              ======================================= */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-[#E3CAA5]
                  bg-white
                  p-2.5
                "
              >
                {/* Avatar */}

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    border-2
                    border-[#E3CAA5]
                    bg-[#AD8B73]
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {adminInfo?.image ? (
                    <img
                      src={adminInfo.image}
                      alt={name}
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  ) : (
                    initial
                  )}
                </div>

                {/* Name + Email */}

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      font-bold
                      text-[#5F4637]
                    "
                  >
                    {name}
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-[11px]
                      font-medium
                      text-[#9A806D]
                    "
                  >
                    {email || "Administrator"}
                  </p>
                </div>
              </div>

              {/* ======================================
                  DIVIDER
              ======================================= */}

              <div className="my-3 h-px w-full bg-[#E3CAA5]" />

              {/* ======================================
                  LOGOUT
              ======================================= */}

              <AlertDialog
                onAgree={handleLogOut}
                dialogTitle="Logout?"
                dialogDetails="Are you sure you want to logout?"
                AgreeButtonValue="Yes, Logout!"
                CancelButton="Cancel"
                triggerButton={(onClickFunc) => (
                  <button
                    type="button"
                    onClick={onClickFunc}
                    className="
                      flex
                      h-10
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-[#E3CAA5]
                      bg-white
                      text-sm
                      font-semibold
                      text-[#806B5D]
                      transition-all
                      duration-200
                      hover:border-[#CEAB93]
                      hover:bg-[#E3CAA5]/30
                      hover:text-[#5F4637]
                    "
                  >
                    <span
                      className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#E3CAA5]/35
                        text-[#AD8B73]
                      "
                    >
                      <IoLogOutOutline className="text-base" />
                    </span>

                    <span>Logout</span>
                  </button>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarProfile;