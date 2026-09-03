// import React, { useState } from "react";

// import AppManagementHeader from "./layouts/AppManagementHeader";
// import ManagementList from "./layouts/ManagementList";
// import AnimatedContent from "@/components/common/AnimatedContent";

// import { FaTag, FaRegNewspaper } from "react-icons/fa";

// /* ============================================================
//    APP MANAGEMENT
//    THEME
// ============================================================ */

// const THEME = {
//   primary: "#AD8B73",
//   secondary: "#CEAB93",
//   border: "#E3CAA5",
//   background: "#FFFBE9",
//   white: "#FFFFFF",
//   text: "#59483D",
//   muted: "#75665C",
// };

// const AppManagement = () => {
//   const [isDispatch, setIsDispatch] = useState(false);
//   const [filterDragger, setFilterDragger] = useState(false);
//   const [currentLink, setCurrentLink] = useState("Offers");
//   const [editValue, setEditValue] = useState({});

//   /* ============================================================
//      REFRESH MANAGEMENT LIST
//   ============================================================ */

//   const getManagementList = () => {
//     setIsDispatch(true);

//     setTimeout(() => {
//       setIsDispatch(false);
//     }, 100);
//   };

//   return (
//     <AnimatedContent>
//       <div
//         className="min-h-screen pb-10"
//         style={{
//           backgroundColor: THEME.background,
//         }}
//       >
//         {/* ======================================================
//             PREMIUM HERO
//         ======================================================= */}

//         <section className="mb-8">
//           <div
//             className="
//               relative
//               overflow-hidden
//               rounded-[22px]
//               border
//               px-6
//               py-7
//               shadow-[0_10px_26px_rgba(89,72,61,0.12)]
//               sm:px-8
//               sm:py-8
//             "
//             style={{
//               backgroundColor: THEME.text,
//               borderColor: THEME.primary,
//             }}
//           >
//             {/* Bottom premium accent */}

//             <div
//               className="
//                 absolute
//                 bottom-0
//                 left-0
//                 h-[3px]
//                 w-full
//               "
//               style={{
//                 backgroundColor: THEME.secondary,
//               }}
//             />

//             <div
//               className="
//                 relative
//                 z-10
//                 flex
//                 flex-col
//                 gap-7
//                 lg:flex-row
//                 lg:items-center
//                 lg:justify-between
//               "
//             >
//               {/* ==================================================
//                   HERO CONTENT
//               ================================================== */}

//               <div className="max-w-2xl">
//                 {/* LABEL */}

//                 <div className="mb-3 flex items-center gap-2.5">
//                   <span
//                     className="
//                       h-2
//                       w-2
//                       rounded-full
//                     "
//                     style={{
//                       backgroundColor: THEME.secondary,
//                     }}
//                   />

//                   <span
//                     className="
//                       text-[10px]
//                       font-bold
//                       uppercase
//                       tracking-[0.22em]
//                     "
//                     style={{
//                       color: THEME.secondary,
//                     }}
//                   >
//                     App Management
//                   </span>
//                 </div>

//                 {/* TITLE */}

//                 <h1
//                   className="
//                     text-[29px]
//                     font-extrabold
//                     leading-tight
//                     tracking-[-0.04em]
//                     text-white
//                     sm:text-[36px]
//                   "
//                 >
//                   Offers &amp; Blogs
//                 </h1>

//                 {/* DESCRIPTION */}

//                 <p
//                   className="
//                     mt-2
//                     max-w-[520px]
//                     text-[13px]
//                     leading-6
//                   "
//                   style={{
//                     color: THEME.border,
//                   }}
//                 >
//                   Create and manage promotional offers and
//                   blog content for your app.
//                 </p>
//               </div>

//               {/* ==================================================
//                   CONTENT TYPES
//               ================================================== */}

//               <div
//                 className="
//                   flex
//                   shrink-0
//                   flex-wrap
//                   items-center
//                   gap-3
//                 "
//               >
//                 {/* OFFER CARD */}

//                 <div
//                   className="
//                     flex
//                     items-center
//                     gap-3
//                     rounded-[13px]
//                     border
//                     px-4
//                     py-3
//                     transition-all
//                     duration-200
//                     hover:-translate-y-0.5
//                   "
//                   style={{
//                     backgroundColor: THEME.primary,
//                     borderColor: THEME.secondary,
//                   }}
//                 >
//                   <div
//                     className="
//                       flex
//                       h-8
//                       w-8
//                       items-center
//                       justify-center
//                       rounded-[9px]
//                     "
//                     style={{
//                       backgroundColor: THEME.border,
//                     }}
//                   >
//                     <FaTag
//                       size={13}
//                       style={{
//                         color: THEME.text,
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <p
//                       className="
//                         text-[9px]
//                         font-semibold
//                         uppercase
//                         tracking-[0.12em]
//                       "
//                       style={{
//                         color: THEME.border,
//                       }}
//                     >
//                       Content
//                     </p>

//                     <p className="mt-0.5 text-[12px] font-bold text-white">
//                       Offers
//                     </p>
//                   </div>
//                 </div>

//                 {/* BLOG CARD */}

//                 <div
//                   className="
//                     flex
//                     items-center
//                     gap-3
//                     rounded-[13px]
//                     border
//                     px-4
//                     py-3
//                     transition-all
//                     duration-200
//                     hover:-translate-y-0.5
//                   "
//                   style={{
//                     backgroundColor: THEME.primary,
//                     borderColor: THEME.secondary,
//                   }}
//                 >
//                   <div
//                     className="
//                       flex
//                       h-8
//                       w-8
//                       items-center
//                       justify-center
//                       rounded-[9px]
//                     "
//                     style={{
//                       backgroundColor: THEME.border,
//                     }}
//                   >
//                     <FaRegNewspaper
//                       size={13}
//                       style={{
//                         color: THEME.text,
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <p
//                       className="
//                         text-[9px]
//                         font-semibold
//                         uppercase
//                         tracking-[0.12em]
//                       "
//                       style={{
//                         color: THEME.border,
//                       }}
//                     >
//                       Content
//                     </p>

//                     <p className="mt-0.5 text-[12px] font-bold text-white">
//                       Blogs
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ======================================================
//             APP MANAGEMENT HEADER
//         ======================================================= */}

//         <section className="mb-5">
//           <div
//             className="
//               rounded-[18px]
//               border
//               bg-white
//               p-1
//             "
//             style={{
//               borderColor: THEME.border,
//             }}
//           >
//             <AppManagementHeader
//               setFilterDragger={setFilterDragger}
//               getManagementList={getManagementList}
//               filterDragger={filterDragger}
//               setCurrentLink={setCurrentLink}
//               currentLink={currentLink}
//               editValue={editValue}
//             />
//           </div>
//         </section>

//         {/* ======================================================
//             MANAGEMENT LIST
//         ======================================================= */}

//         <section>
//           <ManagementList
//             isDispatch={isDispatch}
//             setFilterDragger={setFilterDragger}
//             currentLink={currentLink}
//             setEditValue={setEditValue}
//             filterDragger={filterDragger}
//           />
//         </section>
//       </div>
//     </AnimatedContent>
//   );
// };

// export default AppManagement;

























import React, { useState } from "react";

import AppManagementHeader from "./layouts/AppManagementHeader";
import ManagementList from "./layouts/ManagementList";
import AnimatedContent from "@/components/common/AnimatedContent";

import { FaTag, FaRegNewspaper } from "react-icons/fa";

/* ============================================================
   APP MANAGEMENT
============================================================ */

const AppManagement = () => {
  const [isDispatch, setIsDispatch] = useState(false);
  const [filterDragger, setFilterDragger] = useState(false);
  const [currentLink, setCurrentLink] = useState("Offers");
  const [editValue, setEditValue] = useState({});

  /* ============================================================
     REFRESH MANAGEMENT LIST
  ============================================================ */

  const getManagementList = () => {
    setIsDispatch(true);

    setTimeout(() => {
      setIsDispatch(false);
    }, 100);
  };

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-background pb-10">

        {/* ======================================================
            PREMIUM HERO
        ======================================================= */}

        <section className="mb-8">
          <div
            className="
              relative
              overflow-hidden
              rounded-[22px]
              border
              border-primary
              bg-primary
              px-6
              py-7
              shadow-sm
              sm:px-8
              sm:py-8
            "
          >

            {/* Bottom premium accent */}

            <div
              className="
                absolute
                bottom-0
                left-0
                h-[3px]
                w-full
                bg-secondary
              "
            />

            <div
              className="
                relative
                z-10
                flex
                flex-col
                gap-7
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >

              {/* ==================================================
                  HERO CONTENT
              ================================================== */}

              <div className="max-w-2xl">

                {/* LABEL */}

                {/* TITLE */}

                <h1
                  className="
                    text-[29px]
                    font-extrabold
                    leading-tight
                    tracking-[-0.04em]
                    text-white
                    sm:text-[36px]
                  "
                >
                  Offers &amp; Blogs
                </h1>

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-2
                    max-w-[520px]
                    text-[13px]
                    leading-6
                    text-accent
                  "
                >
                  Create and manage promotional offers and
                  blog content for your app.
                </p>
              </div>

              {/* ==================================================
                  CONTENT TYPES
              ================================================== */}

              <div
                className="
                  flex
                  shrink-0
                  flex-wrap
                  items-center
                  gap-3
                "
              >

                {/* OFFER CARD */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-[13px]
                    border
                    border-secondary
                    bg-secondary
                    px-4
                    py-3
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-[9px]
                      bg-accent
                    "
                  >
                    <FaTag
                      size={13}
                      className="text-primary"
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-accent
                      "
                    >
                      Content
                    </p>

                    <p className="mt-0.5 text-[12px] font-bold text-white">
                      Offers
                    </p>
                  </div>
                </div>

                {/* BLOG CARD */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-[13px]
                    border
                    border-secondary
                    bg-secondary
                    px-4
                    py-3
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                  "
                >
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-[9px]
                      bg-accent
                    "
                  >
                    <FaRegNewspaper
                      size={13}
                      className="text-primary"
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-accent
                      "
                    >
                      Content
                    </p>

                    <p className="mt-0.5 text-[12px] font-bold text-white">
                      Blogs
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            APP MANAGEMENT HEADER
        ======================================================= */}

        <section className="mb-5">
          <div
            className="
              rounded-[18px]
              border
              border-accent
              bg-white
              p-1
            "
          >
            <AppManagementHeader
              setFilterDragger={setFilterDragger}
              getManagementList={getManagementList}
              filterDragger={filterDragger}
              setCurrentLink={setCurrentLink}
              currentLink={currentLink}
              editValue={editValue}
            />
          </div>
        </section>

        {/* ======================================================
            MANAGEMENT LIST
        ======================================================= */}

        <section>
          <ManagementList
            isDispatch={isDispatch}
            setFilterDragger={setFilterDragger}
            currentLink={currentLink}
            setEditValue={setEditValue}
            filterDragger={filterDragger}
          />
        </section>

      </div>
    </AnimatedContent>
  );
};

export default AppManagement;