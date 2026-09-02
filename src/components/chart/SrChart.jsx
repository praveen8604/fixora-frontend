// import { statusTheme } from "@/utils/getStatusTheme";
// import moment from "moment";
// import React from "react";
// import DataTable from "react-data-table-component";
// import { useHistory } from "react-router-dom";
// import {
//   FiArrowUpRight,
//   FiCalendar,
//   FiFileText,
//   FiInbox,
// } from "react-icons/fi";

// const THEME = {
//   primary: "#AD8B73",
//   secondary: "#CEAB93",
//   accent: "#E3CAA5",
//   light: "#FFFBE9",
//   text: "#5F5147",
//   muted: "#8C7B6D",
//   border: "#E9DED1",
// };

// const SrChart = ({ recentSr = [] }) => {
//   const history = useHistory();

//   const goToRequest = (id) => {
//     if (!id) return;

//     history.push(`/services/servicerequests/request?sr_id=${id}`);
//   };

//   const getStatusStyle = (status) => {
//     const value = String(status || "").toLowerCase();

//     if (
//       value.includes("complete") ||
//       value.includes("closed") ||
//       value.includes("deliver")
//     ) {
//       return {
//         backgroundColor: "#E3CAA5",
//         color: "#6F5B4B",
//       };
//     }

//     if (
//       value.includes("pending") ||
//       value.includes("progress") ||
//       value.includes("assign")
//     ) {
//       return {
//         backgroundColor: "#FFFBE9",
//         color: "#8A705D",
//         border: `1px solid ${THEME.accent}`,
//       };
//     }

//     if (
//       value.includes("cancel") ||
//       value.includes("reject")
//     ) {
//       return {
//         backgroundColor: "#F1E4D8",
//         color: "#80604D",
//       };
//     }

//     return {
//       backgroundColor: "#F5EFE8",
//       color: "#766457",
//     };
//   };

//   const serviceRequestsColumns = [
//     {
//       name: "SR ID",

//       selector: (row) => row?._id,

//       cell: (row) => (
//         <div
//           onClick={() => goToRequest(row?._id)}
//           className="
//             group/id
//             flex
//             cursor-pointer
//             items-center
//             gap-2
//             font-semibold
//             text-[#75665C]
//             transition-colors
//             duration-200
//             hover:text-[#AD8B73]
//           "
//         >
//           <span
//             className="
//               flex
//               h-7
//               min-w-7
//               items-center
//               justify-center
//               rounded-lg
//               bg-[#FFFBE9]
//               px-1.5
//               text-[10px]
//               font-bold
//               text-[#AD8B73]
//               transition-all
//               duration-200
//               group-hover/id:bg-[#AD8B73]
//               group-hover/id:text-white
//             "
//           >
//             #
//           </span>

//           <span className="max-w-[70px] truncate text-[11px]">
//             {row?._id}
//           </span>
//         </div>
//       ),

//       width: "120px",
//     },

//     {
//       name: "PROBLEM DESCRIPTION",

//       selector: (row) => row?.problemDescription,

//       cell: (row) => (
//         <div
//           onClick={() => goToRequest(row?._id)}
//           className="
//             flex
//             min-w-0
//             cursor-pointer
//             items-center
//             gap-2
//             text-[#65584F]
//             transition-colors
//             duration-200
//             hover:text-[#4F433B]
//           "
//         >
//           <FiFileText
//             className="shrink-0 text-[14px] text-[#CEAB93]"
//           />

//           <span
//             className="
//               block
//               max-w-[190px]
//               truncate
//               text-[11px]
//               font-medium
//             "
//             title={row?.problemDescription}
//           >
//             {row?.problemDescription || "No description"}
//           </span>
//         </div>
//       ),

//       width: "235px",
//     },

//     {
//       name: "STATUS",

//       selector: (row) => row?.ticketStatus,

//       cell: (row) => {
//         const statusStyle = getStatusStyle(row?.ticketStatus);

//         return (
//           <div
//             onClick={() => goToRequest(row?._id)}
//             className="
//               cursor-pointer
//               rounded-full
//               px-3
//               py-1.5
//               text-[10px]
//               font-semibold
//               capitalize
//               transition-transform
//               duration-200
//               hover:scale-105
//             "
//             style={statusStyle}
//           >
//             {row?.ticketStatus || "Unknown"}
//           </div>
//         );
//       },

//       width: "135px",
//     },

//     {
//       name: "RAISED ON",

//       selector: (row) => row?.createdAt,

//       cell: (row) => (
//         <div
//           onClick={() => goToRequest(row?._id)}
//           className="
//             flex
//             cursor-pointer
//             items-center
//             gap-2
//             text-[#8C7B6D]
//           "
//         >
//           <FiCalendar className="text-[13px] text-[#CEAB93]" />

//           <div>
//             <p className="text-[10px] font-semibold text-[#65584F]">
//               {row?.createdAt
//                 ? moment(row.createdAt).format("DD MMM YYYY")
//                 : "-"}
//             </p>

//             <p className="mt-0.5 text-[9px] text-[#A08F82]">
//               {row?.createdAt
//                 ? moment(row.createdAt).format("hh:mm A")
//                 : "-"}
//             </p>
//           </div>
//         </div>
//       ),

//       width: "150px",
//     },

//     {
//       name: "",

//       cell: (row) => (
//         <button
//           type="button"
//           onClick={() => goToRequest(row?._id)}
//           className="
//             flex
//             h-8
//             w-8
//             items-center
//             justify-center
//             rounded-xl
//             border
//             border-[#E9DED1]
//             bg-[#FFFBE9]
//             text-[#9A8575]
//             transition-all
//             duration-200
//             hover:border-[#AD8B73]
//             hover:bg-[#AD8B73]
//             hover:text-white
//           "
//           title="Open request"
//         >
//           <FiArrowUpRight className="text-[13px]" />
//         </button>
//       ),

//       width: "55px",

//       right: true,
//     },
//   ];

//   const customStyles = {
//     table: {
//       style: {
//         backgroundColor: "transparent",
//       },
//     },

//     headRow: {
//       style: {
//         minHeight: "42px",
//         borderBottom: `1px solid ${THEME.border}`,
//         backgroundColor: THEME.light,
//         borderRadius: "12px",
//       },
//     },

//     headCells: {
//       style: {
//         paddingLeft: "12px",
//         paddingRight: "12px",
//         color: "#927F70",
//         fontSize: "9px",
//         fontWeight: "700",
//         letterSpacing: "0.07em",
//         textTransform: "uppercase",
//       },
//     },

//     rows: {
//       style: {
//         minHeight: "66px",
//         borderBottom: "1px solid #F1E9E1",
//         backgroundColor: "#FFFFFF",
//         transition: "all 0.2s ease",
//       },

//       highlightOnHoverStyle: {
//         backgroundColor: "#FFFBE9",
//         borderBottomColor: "#E3CAA5",
//         cursor: "pointer",
//         transform: "translateY(-1px)",
//       },
//     },

//     cells: {
//       style: {
//         paddingLeft: "12px",
//         paddingRight: "12px",
//         fontSize: "11px",
//       },
//     },

//     noData: {
//       style: {
//         minHeight: "260px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       },
//     },

//     pagination: {
//       style: {
//         borderTop: `1px solid ${THEME.border}`,
//         minHeight: "45px",
//       },
//     },
//   };

//   return (
//     <div className="w-full">
//       {/* TABLE */}

//       <div
//         className="
//           overflow-hidden
//           rounded-[16px]
//           border
//           border-[#E9DED1]
//           bg-white
//         "
//       >
//         <DataTable
//           columns={serviceRequestsColumns}
//           data={recentSr || []}
//           onRowClicked={(row) => goToRequest(row?._id)}
//           fixedHeader
//           fixedHeaderScrollHeight="290px"
//           customStyles={customStyles}
//           className="dashboard-service-table"
//           highlightOnHover
//           responsive
//           persistTableHead
//           noDataComponent={
//             <div
//               className="
//                 flex
//                 min-h-[260px]
//                 w-full
//                 flex-col
//                 items-center
//                 justify-center
//                 px-5
//                 text-center
//               "
//             >
//               <div
//                 className="
//                   mb-4
//                   flex
//                   h-14
//                   w-14
//                   items-center
//                   justify-center
//                   rounded-2xl
//                   bg-[#FFFBE9]
//                   text-[#AD8B73]
//                 "
//               >
//                 <FiInbox className="text-[22px]" />
//               </div>

//               <h4 className="text-sm font-bold text-[#65584F]">
//                 No recent requests
//               </h4>

//               <p className="mt-1 max-w-[220px] text-[10px] leading-5 text-[#9A897B]">
//                 No service requests are available right now.
//               </p>
//             </div>
//           }
//         />
//       </div>
//     </div>
//   );
// };

// export default SrChart;
























import moment from "moment";
import React from "react";
import DataTable from "react-data-table-component";
import { useHistory } from "react-router-dom";
import {
  FiArrowUpRight,
  FiCalendar,
  FiFileText,
  FiInbox,
} from "react-icons/fi";
import COLORS from "@/components/theme/colors";

const SrChart = ({ recentSr = [] }) => {
  const history = useHistory();

  const goToRequest = (id) => {
    history.push(`/services/servicerequests/request?sr_id=${id}`);
  };

  /* =========================================================
     STATUS STYLE
  ========================================================= */

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value.includes("complete") ||
      value.includes("closed") ||
      value.includes("deliver")
    ) {
      return {
        backgroundColor: COLORS.accent,
        color: COLORS.primary,
        borderColor: COLORS.accent,
      };
    }

    if (
      value.includes("pending") ||
      value.includes("progress") ||
      value.includes("assign")
    ) {
      return {
        backgroundColor: COLORS.background,
        color: COLORS.secondary,
        borderColor: COLORS.accent,
      };
    }

    if (value.includes("cancel") || value.includes("reject")) {
      return {
        backgroundColor: "#F3F5F4",
        color: "#64756F",
        borderColor: "#DCE5E1",
      };
    }

    return {
      backgroundColor: COLORS.background,
      color: COLORS.secondary,
      borderColor: "#E8EEEB",
    };
  };

  /* =========================================================
     TABLE COLUMNS
  ========================================================= */

  const columns = [
    {
      name: "SR ID",
      selector: (row) => row?._id,
      sortable: true,
      width: "125px",

      cell: (row) => (
        <button
          type="button"
          onClick={() => goToRequest(row?._id)}
          className="
            group/id
            flex
            items-center
            gap-2
            text-left
            focus:outline-none
          "
        >
          <span
            className="
              flex
              h-7
              min-w-[30px]
              items-center
              justify-center
              rounded-lg
              bg-accent
              px-1.5
              text-[9px]
              font-extrabold
              text-primary
            "
          >
            #
          </span>

          <span
            className="
              max-w-[65px]
              truncate
              text-[10px]
              font-bold
              text-primary
              group-hover/id:text-secondary
            "
          >
            {row?._id}
          </span>
        </button>
      ),
    },

    {
      name: "PROBLEM DESCRIPTION",
      selector: (row) => row?.problemDescription,
      sortable: true,
      grow: 2,

      cell: (row) => (
        <button
          type="button"
          onClick={() => goToRequest(row?._id)}
          className="
            group/problem
            flex
            min-w-0
            items-center
            gap-2.5
            text-left
            focus:outline-none
          "
        >
          <span
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-background
              text-secondary
              transition-all
              duration-200
              group-hover/problem:bg-accent
              group-hover/problem:text-primary
            "
          >
            <FiFileText size={13} />
          </span>

          <span
            className="
              line-clamp-2
              text-[10px]
              font-semibold
              leading-4
              text-primary
              group-hover/problem:text-secondary
            "
          >
            {row?.problemDescription || "—"}
          </span>
        </button>
      ),
    },

    {
      name: "STATUS",
      selector: (row) => row?.ticketStatus,
      sortable: true,
      width: "120px",

      cell: (row) => {
        const style = getStatusStyle(row?.ticketStatus);

        return (
          <button
            type="button"
            onClick={() => goToRequest(row?._id)}
            className="
              rounded-full
              border
              px-2.5
              py-1.5
              text-[9px]
              font-bold
              capitalize
              transition-all
              duration-200
              hover:shadow-sm
              focus:outline-none
            "
            style={style}
          >
            {row?.ticketStatus || "—"}
          </button>
        );
      },
    },

    {
      name: "RAISED ON",
      selector: (row) => row?.createdAt,
      sortable: true,
      width: "145px",

      cell: (row) => (
        <button
          type="button"
          onClick={() => goToRequest(row?._id)}
          className="
            group/date
            flex
            items-center
            gap-2
            text-left
            focus:outline-none
          "
        >
          <span
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-background
              text-secondary
              transition-all
              duration-200
              group-hover/date:bg-accent
              group-hover/date:text-primary
            "
          >
            <FiCalendar size={13} />
          </span>

          <span>
            <span className="block text-[10px] font-bold text-primary">
              {row?.createdAt
                ? moment(row.createdAt).format("DD MMM YYYY")
                : "—"}
            </span>

            <span className="mt-0.5 block text-[9px] font-medium text-secondary">
              {row?.createdAt
                ? moment(row.createdAt).format("hh:mm A")
                : ""}
            </span>
          </span>
        </button>
      ),
    },

    {
      name: "",
      width: "55px",
      center: true,

      cell: (row) => (
        <button
          type="button"
          onClick={() => goToRequest(row?._id)}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-accent
            bg-background
            text-secondary
            transition-all
            duration-200
            hover:border-secondary
            hover:bg-accent
            hover:text-primary
            focus:outline-none
          "
          aria-label="View service request"
        >
          <FiArrowUpRight size={14} />
        </button>
      ),
    },
  ];

  /* =========================================================
     TABLE STYLES
  ========================================================= */

  const customStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
      },
    },

    tableWrapper: {
      style: {
        backgroundColor: "transparent",
      },
    },

    headRow: {
      style: {
        minHeight: "42px",
        backgroundColor: COLORS.background,
        borderBottom: `1px solid #E8EEEB`,
        borderRadius: "10px",
      },
    },

    headCells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        color: COLORS.secondary,
        fontSize: "9px",
        fontWeight: "800",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      },
    },

    rows: {
      style: {
        minHeight: "66px",
        backgroundColor: "#FFFFFF",
        borderBottom: `1px solid #E8EEEB`,
        transition: "all 0.2s ease",
      },

      highlightOnHoverStyle: {
        backgroundColor: COLORS.background,
        borderBottomColor: COLORS.accent,
        cursor: "pointer",
        outline: "none",
        transform: "translateY(-1px)",
      },
    },

    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        fontSize: "10px",
      },
    },

    noData: {
      style: {
        minHeight: "260px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },

    pagination: {
      style: {
        minHeight: "45px",
        borderTop: `1px solid #E8EEEB`,
        backgroundColor: "#FFFFFF",
        color: COLORS.secondary,
        fontSize: "10px",
      },
    },
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-[#E8EEEB]
        bg-white
      "
    >
      <DataTable
        columns={columns}
        data={recentSr}
        customStyles={customStyles}
        fixedHeader
        fixedHeaderScrollHeight="290px"
        highlightOnHover
        responsive
        persistTableHead
        noDataComponent={
          <div className="flex flex-col items-center justify-center py-10">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-accent
                text-primary
              "
            >
              <FiInbox size={18} />
            </div>

            <p className="mt-3 text-xs font-bold text-primary">
              No recent requests
            </p>

            <p className="mt-1 text-[10px] text-secondary">
              New service requests will appear here
            </p>
          </div>
        }
      />
    </div>
  );
};

export default SrChart;