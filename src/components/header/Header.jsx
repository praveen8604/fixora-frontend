// import React, {
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import Cookies from "js-cookie";
// import {
//   FiChevronDown,
//   FiGrid,
//   FiLogOut,
// } from "react-icons/fi";

// import sidebar from "@/routes/sidebar";
// import { AdminContext } from "@/context/AdminContext";
// import AlertDialog from "@/components/common/AlterDialogBox";

// const Header = () => {
//   const { t } = useTranslation();
//   const { pathname } = useLocation();

//   const { state, dispatch } = useContext(AdminContext);
//   const { adminInfo } = state || {};

//   const [profileOpen, setProfileOpen] = useState(false);

//   const profileRef = useRef(null);

//   /* =========================================================
//      CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
//   ========================================================= */

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(event.target)
//       ) {
//         setProfileOpen(false);
//       }
//     };

//     document.addEventListener(
//       "mousedown",
//       handleClickOutside
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );
//     };
//   }, []);

//   /* =========================================================
//      PROFILE DROPDOWN
//   ========================================================= */

//   const handleProfileOpen = () => {
//     setProfileOpen((prev) => !prev);
//   };

//   /* =========================================================
//      LOGOUT
//   ========================================================= */

//   const handleLogOut = () => {
//     dispatch({
//       type: "USER_LOGOUT",
//     });

//     Cookies.remove("adminInfo");
//     Cookies.remove("token");

//     setProfileOpen(false);

//     window.location.replace("/login");
//   };

//   /* =========================================================
//      HEADER TITLE
//   ========================================================= */

//   const getHeaderTitle = () => {
//     const extraTitles = [
//       {
//         path: "/services/servicerequests/request",
//         name: "Service Request",
//       },
//       {
//         path: "/users/technician/details",
//         name: "Technician Details",
//       },
//       {
//         path: "/users/rider/details",
//         name: "Rider Details",
//       },
//       {
//         path: "/users/customer/details",
//         name: "Customer Details",
//       },
//       {
//         path: "/appliance/overview",
//         name: "Appliance Overview",
//       },
//       {
//         path: "/user",
//         name: "User Details",
//       },
//     ];

//     const extraMatch = extraTitles.find(
//       (item) =>
//         pathname === item.path ||
//         pathname.startsWith(`${item.path}?`)
//     );

//     if (extraMatch) {
//       return extraMatch.name;
//     }

//     for (const route of sidebar) {
//       if (route.subMenu?.length) {
//         const child = [...route.subMenu]
//           .sort(
//             (a, b) =>
//               b.path.length - a.path.length
//           )
//           .find(
//             (item) =>
//               pathname === item.path ||
//               pathname.startsWith(`${item.path}/`)
//           );

//         if (child) {
//           return child.name;
//         }
//       }

//       if (
//         pathname === route.path ||
//         pathname.startsWith(`${route.path}/`)
//       ) {
//         return route.name;
//       }
//     }

//     return "Dashboard";
//   };

//   const headerTitle = getHeaderTitle();

//   /* =========================================================
//      RENDER
//   ========================================================= */

//   return (
//     <>
//       {/* =====================================================
//           HEADER
//       ====================================================== */}

//       <header
//         className="
//           fixed
//           top-0
//           right-0
//           z-[40]
//           h-[72px]
//           w-full
//           border-b
//           border-[#E3CAA5]
//           bg-[#FFFBE9]
//           shadow-[0_3px_18px_rgba(173,139,115,0.08)]
//         "
//       >
//         <div
//           className="
//             flex
//             h-full
//             items-center
//             justify-between
//             px-5
//             md:px-7
//             lg:pl-[80px]
//             lg:pr-7
//           "
//         >
//           {/* =================================================
//               LEFT SIDE
//           ================================================== */}

//           <div className="flex min-w-0 items-center">

//             {/* Vertical Accent */}

//             <div
//               className="
//                 mr-4
//                 hidden
//                 h-9
//                 w-[4px]
//                 rounded-full
//                 bg-[#AD8B73]
//                 md:block
//               "
//             />

//             <div className="min-w-0">

//               {/* Small Heading */}

//               <div
//                 className="
//                   mb-0.5
//                   text-[10px]
//                   font-bold
//                   uppercase
//                   tracking-[0.14em]
//                   text-[#9A806D]
//                 "
//               >
//                 Admin Panel
//               </div>

//               {/* Page Title */}

//               <h1
//                 className="
//                   truncate
//                   text-[18px]
//                   font-bold
//                   leading-tight
//                   text-[#5F4637]
//                   md:text-[20px]
//                 "
//               >
//                 {headerTitle}
//               </h1>
//             </div>
//           </div>

//           {/* =================================================
//               RIGHT SIDE
//           ================================================== */}

//           <div className="flex items-center">

//             {/* =================================================
//                 PROFILE
//             ================================================== */}

//             <div
//               className="relative"
//               ref={profileRef}
//             >
//               <button
//                 type="button"
//                 onClick={handleProfileOpen}
//                 aria-label="Open profile menu"
//                 className="
//                   group
//                   flex
//                   items-center
//                   gap-2.5
//                   rounded-full
//                   border
//                   border-[#E3CAA5]
//                   bg-white
//                   py-1.5
//                   pl-2
//                   pr-3
//                   transition-all
//                   duration-200
//                   hover:border-[#CEAB93]
//                   hover:bg-[#FFFBE9]
//                   hover:shadow-[0_5px_16px_rgba(173,139,115,0.12)]
//                   focus:outline-none
//                 "
//               >

//                 {/* Avatar */}

//                 <div
//                   className="
//                     flex
//                     h-9
//                     w-9
//                     items-center
//                     justify-center
//                     overflow-hidden
//                     rounded-full
//                     border-2
//                     border-[#E3CAA5]
//                     bg-[#AD8B73]
//                     text-sm
//                     font-bold
//                     text-white
//                   "
//                 >
//                   {adminInfo?.image ? (
//                     <img
//                       className="h-full w-full object-cover"
//                       src={adminInfo.image}
//                       alt="Admin"
//                     />
//                   ) : (
//                     <span>
//                       {adminInfo?.email
//                         ? adminInfo.email[0].toUpperCase()
//                         : "A"}
//                     </span>
//                   )}
//                 </div>

//                 {/* Profile Info */}

//                 <div className="hidden max-w-[130px] text-left sm:block">
//                   <p
//                     className="
//                       truncate
//                       text-[12px]
//                       font-bold
//                       text-[#5F4637]
//                     "
//                   >
//                     {adminInfo?.email ||
//                       "Administrator"}
//                   </p>

//                   <p
//                     className="
//                       text-[10px]
//                       font-medium
//                       text-[#9A806D]
//                     "
//                   >
//                     Administrator
//                   </p>
//                 </div>

//                 {/* Chevron */}

//                 <FiChevronDown
//                   size={15}
//                   className={`
//                     text-[#AD8B73]
//                     transition-transform
//                     duration-200
//                     ${
//                       profileOpen
//                         ? "rotate-180"
//                         : "rotate-0"
//                     }
//                   `}
//                 />
//               </button>

//               {/* =================================================
//                   PROFILE DROPDOWN
//               ================================================== */}

//               {profileOpen && (
//                 <div
//                   className="
//                     absolute
//                     right-0
//                     top-[52px]
//                     w-[230px]
//                     overflow-hidden
//                     rounded-2xl
//                     border
//                     border-[#E3CAA5]
//                     bg-[#FFFBE9]
//                     shadow-[0_16px_38px_rgba(173,139,115,0.16)]
//                   "
//                 >

//                   {/* Dropdown Header */}

//                   <div
//                     className="
//                       border-b
//                       border-[#E3CAA5]
//                       bg-[#E3CAA5]/25
//                       px-4
//                       py-3.5
//                     "
//                   >
//                     <p
//                       className="
//                         text-[10px]
//                         font-bold
//                         uppercase
//                         tracking-[0.14em]
//                         text-[#AD8B73]
//                       "
//                     >
//                       Account
//                     </p>

//                     <p
//                       className="
//                         mt-0.5
//                         truncate
//                         text-sm
//                         font-bold
//                         text-[#5F4637]
//                       "
//                     >
//                       {adminInfo?.email ||
//                         "Administrator"}
//                     </p>
//                   </div>

//                   {/* =================================================
//                       DASHBOARD
//                   ================================================== */}

//                   <Link
//                     to="/dashboard"
//                     onClick={() =>
//                       setProfileOpen(false)
//                     }
//                     className="
//                       group
//                       flex
//                       items-center
//                       gap-3
//                       px-4
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#806B5D]
//                       no-underline
//                       transition-all
//                       duration-200
//                       hover:bg-[#E3CAA5]/30
//                       hover:text-[#5F4637]
//                     "
//                   >
//                     <span
//                       className="
//                         flex
//                         h-9
//                         w-9
//                         items-center
//                         justify-center
//                         rounded-xl
//                         bg-[#E3CAA5]/35
//                         text-[#AD8B73]
//                         transition-all
//                         duration-200
//                         group-hover:bg-[#AD8B73]
//                         group-hover:text-white
//                       "
//                     >
//                       <FiGrid size={16} />
//                     </span>

//                     <span>
//                       {t("Dashboard")}
//                     </span>
//                   </Link>

//                   {/* =================================================
//                       LOGOUT
//                   ================================================== */}

//                   <AlertDialog
//                     onClickInsider={() =>
//                       setProfileOpen(true)
//                     }
//                     onAgree={handleLogOut}
//                     dialogTitle="Logout?"
//                     dialogDetails="Are you sure you want to logout?"
//                     AgreeButtonValue="Yes, Logout!"
//                     CancelButton="Cancel"
//                     triggerButton={(onClickFunc) => (
//                       <button
//                         type="button"
//                         onClick={onClickFunc}
//                         className="
//                           group
//                           flex
//                           w-full
//                           items-center
//                           gap-3
//                           border-t
//                           border-[#E3CAA5]
//                           px-4
//                           py-3
//                           text-sm
//                           font-semibold
//                           text-[#806B5D]
//                           transition-all
//                           duration-200
//                           hover:bg-[#E3CAA5]/30
//                           hover:text-[#5F4637]
//                         "
//                       >
//                         <span
//                           className="
//                             flex
//                             h-9
//                             w-9
//                             items-center
//                             justify-center
//                             rounded-xl
//                             bg-[#E3CAA5]/35
//                             text-[#AD8B73]
//                             transition-all
//                             duration-200
//                             group-hover:bg-[#AD8B73]
//                             group-hover:text-white
//                           "
//                         >
//                           <FiLogOut size={16} />
//                         </span>

//                         <span>
//                           {t("LogOut")}
//                         </span>
//                       </button>
//                     )}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* =====================================================
//           HEADER SPACER
//       ====================================================== */}

//       <div
//         className="w-full shrink-0"
//         style={{
//           height: "72px",
//           minHeight: "72px",
//         }}
//       />
//     </>
//   );
// };

// export default Header;

























import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import {
  FiChevronDown,
  FiGrid,
  FiLogOut,
} from "react-icons/fi";

import sidebar from "@/routes/sidebar";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import AlertDialog from "@/components/common/AlterDialogBox";

const Header = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const { state, dispatch } = useContext(AdminContext);
  const { adminInfo } = state || {};

  const { isSidebarOpen } = useContext(SidebarContext);

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  /* =========================================================
     CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     PROFILE DROPDOWN
  ========================================================= */

  const handleProfileOpen = () => {
    setProfileOpen((prev) => !prev);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogOut = () => {
    dispatch({
      type: "USER_LOGOUT",
    });

    Cookies.remove("adminInfo");
    Cookies.remove("token");

    setProfileOpen(false);

    window.location.replace("/login");
  };

  /* =========================================================
     HEADER TITLE
  ========================================================= */

  const getHeaderTitle = () => {
    const extraTitles = [
      {
        path: "/services/servicerequests/request",
        name: "Service Request",
      },
      {
        path: "/users/technician/details",
        name: "Technician Details",
      },
      {
        path: "/users/rider/details",
        name: "Rider Details",
      },
      {
        path: "/users/customer/details",
        name: "Customer Details",
      },
      {
        path: "/appliance/overview",
        name: "Appliance Overview",
      },
      {
        path: "/user",
        name: "User Details",
      },
    ];

    const extraMatch = extraTitles.find(
      (item) =>
        pathname === item.path ||
        pathname.startsWith(`${item.path}?`)
    );

    if (extraMatch) {
      return extraMatch.name;
    }

    for (const route of sidebar) {
      if (route.subMenu?.length) {
        const child = [...route.subMenu]
          .sort(
            (a, b) =>
              b.path.length - a.path.length
          )
          .find(
            (item) =>
              pathname === item.path ||
              pathname.startsWith(`${item.path}/`)
          );

        if (child) {
          return child.name;
        }
      }

      if (
        pathname === route.path ||
        pathname.startsWith(`${route.path}/`)
      ) {
        return route.name;
      }
    }

    return "Dashboard";
  };

  const headerTitle = getHeaderTitle();

  /* =========================================================
     SIDEBAR BASED HEADER POSITION
  ========================================================= */

  const headerLeft = isSidebarOpen ? "256px" : "70px";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          fixed
          top-0
          right-0
          z-[40]
          h-[72px]
          border-b
          border-accent/60
          bg-white
          shadow-[0_3px_18px_rgba(10,48,36,0.06)]
        "
        style={{
          left: headerLeft,
          width: `calc(100% - ${headerLeft})`,
          transition:
            "left 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className="
            flex
            h-full
            items-center
            justify-between
            px-5
            md:px-7
            lg:pr-7
          "
        >
          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div className="flex min-w-0 items-center">
            {/* Vertical Accent */}

            <div
              className="
                mr-4
                hidden
                h-9
                w-[4px]
                rounded-full
                bg-primary
                md:block
              "
            />

            <div className="min-w-0">
              {/* Admin Panel */}

              <div
                className="
                  mb-0.5
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-secondary
                "
              >
                Admin Panel
              </div>

              {/* Page Title */}

              <h1
                className="
                  truncate
                  text-[18px]
                  font-bold
                  leading-tight
                  text-primary
                  md:text-[20px]
                "
              >
                {headerTitle}
              </h1>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div className="flex items-center">
            {/* =================================================
                PROFILE
            ================================================== */}

            <div
              className="relative"
              ref={profileRef}
            >
              <button
                type="button"
                onClick={handleProfileOpen}
                aria-label="Open profile menu"
                className="
                  group
                  flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-accent
                  bg-white
                  py-1.5
                  pl-2
                  pr-3
                  transition-all
                  duration-200
                  hover:border-secondary
                  hover:bg-background
                  hover:shadow-[0_5px_16px_rgba(10,48,36,0.10)]
                  focus:outline-none
                "
              >
                {/* Avatar */}

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    border-2
                    border-accent
                    bg-primary
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {adminInfo?.image ? (
                    <img
                      className="h-full w-full object-cover"
                      src={adminInfo.image}
                      alt="Admin"
                    />
                  ) : (
                    <span>
                      {adminInfo?.email
                        ? adminInfo.email[0].toUpperCase()
                        : "A"}
                    </span>
                  )}
                </div>

                {/* Profile Info */}

                <div className="hidden max-w-[130px] text-left sm:block">
                  <p
                    className="
                      truncate
                      text-[12px]
                      font-bold
                      text-primary
                    "
                  >
                    {adminInfo?.email || "Administrator"}
                  </p>

                  <p
                    className="
                      text-[10px]
                      font-medium
                      text-secondary
                    "
                  >
                    Administrator
                  </p>
                </div>

                {/* Chevron */}

                <FiChevronDown
                  size={15}
                  className={`
                    text-secondary
                    transition-transform
                    duration-200
                    ${
                      profileOpen
                        ? "rotate-180"
                        : "rotate-0"
                    }
                  `}
                />
              </button>

              {/* =================================================
                  PROFILE DROPDOWN
              ================================================== */}

              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[52px]
                    w-[230px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-accent
                    bg-white
                    shadow-[0_16px_38px_rgba(10,48,36,0.14)]
                  "
                >
                  {/* Dropdown Header */}

                  <div
                    className="
                      border-b
                      border-accent/60
                      bg-background
                      px-4
                      py-3.5
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.14em]
                        text-secondary
                      "
                    >
                      Account
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-sm
                        font-bold
                        text-primary
                      "
                    >
                      {adminInfo?.email || "Administrator"}
                    </p>
                  </div>

                  {/* =================================================
                      DASHBOARD
                  ================================================== */}

                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="
                      group
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-secondary
                      no-underline
                      transition-all
                      duration-200
                      hover:bg-accent/30
                      hover:text-primary
                    "
                  >
                    <span
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-accent/50
                        text-primary
                        transition-all
                        duration-200
                        group-hover:bg-secondary
                        group-hover:text-white
                      "
                    >
                      <FiGrid size={16} />
                    </span>

                    <span>
                      {t("Dashboard")}
                    </span>
                  </Link>

                  {/* =================================================
                      LOGOUT
                  ================================================== */}

                  <AlertDialog
                    onClickInsider={() =>
                      setProfileOpen(true)
                    }
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
                          group
                          flex
                          w-full
                          items-center
                          gap-3
                          border-t
                          border-accent/60
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          text-secondary
                          transition-all
                          duration-200
                          hover:bg-accent/30
                          hover:text-primary
                        "
                      >
                        <span
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-accent/50
                            text-primary
                            transition-all
                            duration-200
                            group-hover:bg-secondary
                            group-hover:text-white
                          "
                        >
                          <FiLogOut size={16} />
                        </span>

                        <span>
                          {t("LogOut")}
                        </span>
                      </button>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          HEADER SPACER
      ====================================================== */}

      <div
        className="w-full shrink-0"
        style={{
          height: "72px",
          minHeight: "72px",
        }}
      />
    </>
  );
};

export default Header;