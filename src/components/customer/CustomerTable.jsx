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
            className="transition-all duration-200 hover:bg-[#FFFBE9] border-b border-[#E3CAA5]/40"
          >
            {/* Customer ID */}
            <TableCell>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FFFBE9] border border-[#E3CAA5] text-[10px] font-bold text-[#AD8B73]">
                #{user?._id?.substring(20, 24)}
              </span>
            </TableCell>

            {/* Joining Date */}
            <TableCell>
              <div className="flex flex-col">
                <span className="text-[11.5px] font-bold text-[#3D2C1E]">
                  {dayjs(user.createdAt).format("MMM D, YYYY")}
                </span>
                <span className="text-[10px] text-[#CEAB93]">
                  {dayjs(user.createdAt).format("hh:mm A")}
                </span>
              </div>
            </TableCell>

            {/* Customer Name */}
            <TableCell>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-extrabold bg-[#FFFBE9] text-[#AD8B73] border border-[#E3CAA5]"
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "C"}
                </div>

                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-[#3D2C1E]">
                    {user?.name || "N/A"}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#CEAB93]">
                    Customer
                  </span>
                </div>
              </div>
            </TableCell>

            {/* Email */}
            <TableCell>
              <span className="text-[11.5px] font-medium text-[#6B5344]">
                {user?.email || "N/A"}
              </span>
            </TableCell>

            {/* Phone */}
            <TableCell>
              <span className="text-[11.5px] font-semibold text-[#6B5344]">
                {user?.phone || "N/A"}
              </span>
            </TableCell>

            {/* Actions */}
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                {/* View Orders */}
                <Link to={`/users/customer-order/${user._id}`}>
                  <div
                    className="p-2 rounded-lg transition-all duration-200 text-[#CEAB93] hover:text-[#AD8B73] hover:bg-[#FFFBE9]"
                  >
                    <Tooltip
                      id={`view-${user._id}`}
                      Icon={FiZoomIn}
                      title={t("ViewOrder")}
                      bgColor="#AD8B73"
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