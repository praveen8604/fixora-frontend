import React from "react";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";

// internal import
import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const OrderTable = ({ orders }) => {
  const {
    currency,
    showDateTimeFormat,
    getNumberTwo,
  } = useUtilsFunction();

  return (
    <TableBody>
      {orders?.map((order) => (
        <TableRow
          key={order._id}
          className="
            border-b
            border-[#E3CAA5]/60
            transition-colors
            duration-200
            hover:bg-[#FFFBE9]
          "
        >
          {/* DATE */}

          <TableCell>
            <span
              className="
                text-sm
                font-medium
                text-[#806650]
              "
            >
              {showDateTimeFormat(order.createdAt)}
            </span>
          </TableCell>

          {/* CUSTOMER */}

          <TableCell>
            <span
              className="
                text-sm
                font-semibold
                text-[#5C4636]
              "
            >
              {order?.user_info?.name || "—"}
            </span>
          </TableCell>

          {/* PAYMENT METHOD */}

          <TableCell>
            <span
              className="
                inline-flex
                rounded-lg
                bg-[#FFFBE9]
                px-2.5
                py-1
                text-xs
                font-semibold
                text-[#AD8B73]
                ring-1
                ring-[#E3CAA5]
              "
            >
              {order.paymentMethod || "—"}
            </span>
          </TableCell>

          {/* TOTAL */}

          <TableCell>
            <span
              className="
                text-sm
                font-bold
                text-[#5C4636]
              "
            >
              {currency}
              {getNumberTwo(order.total)}
            </span>
          </TableCell>

          {/* EMAIL */}

          <TableCell>
            <span
              className="
                text-sm
                font-medium
                text-[#806650]
              "
            >
              {order?.user_info?.email || "—"}
            </span>
          </TableCell>

          {/* STATUS */}

          <TableCell>
            <Status status={order.status} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default OrderTable;