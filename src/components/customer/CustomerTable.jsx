import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import dayjs from "dayjs";
import { t } from "i18next";
import React from "react";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";

// internal import
import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import Tooltip from "@/components/tooltip/Tooltip";
import CustomerDrawer from "@/components/drawer/CustomerDrawer";
import EditDeleteButton from "@/components/table/EditDeleteButton";

const CustomerTable = ({ customers }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } =
    useToggleDrawer();

  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      <MainDrawer>
        <CustomerDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {customers?.map((user) => (
          <TableRow
            key={user._id}
            className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {/* Customer ID */}
            <TableCell>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300">
                #{user?._id?.substring(20, 24)}
              </span>
            </TableCell>

            {/* Joining Date */}
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {dayjs(user.createdAt).format("MMM D, YYYY")}
                </span>
                <span className="text-xs text-gray-400">
                  {dayjs(user.createdAt).format("hh:mm A")}
                </span>
              </div>
            </TableCell>

            {/* Customer Name */}
            <TableCell>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: "var(--secondary-elite-color)",
                    color: "var(--primary-elite-color)",
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "C"}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {user?.name || "N/A"}
                  </span>
                  <span className="text-xs text-gray-400">
                    Customer
                  </span>
                </div>
              </div>
            </TableCell>

            {/* Email */}
            <TableCell>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user?.email || "N/A"}
              </span>
            </TableCell>

            {/* Phone */}
            <TableCell>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.phone || "N/A"}
              </span>
            </TableCell>

            {/* Actions */}
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                {/* View Orders */}
                <Link to={`/users/customer-order/${user._id}`}>
                  <div
                    className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    style={{
                      color: "var(--primary-elite-color)",
                    }}
                  >
                    <Tooltip
                      id={`view-${user._id}`}
                      Icon={FiZoomIn}
                      title={t("ViewOrder")}
                      bgColor="var(--primary-elite-color)"
                    />
                  </div>
                </Link>

                {/* Edit / Delete */}
                <EditDeleteButton
                  title={user.name}
                  id={user._id}
                  handleUpdate={handleUpdate}
                  handleModalOpen={handleModalOpen}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CustomerTable;