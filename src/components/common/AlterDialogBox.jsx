import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { IoLogOutOutline } from "react-icons/io5";

export default function AlertDialog({
  dialogTitle,
  dialogDetails,
  AgreeButtonValue = "Yes, Agree!",
  CancelButton = "Cancel",
  triggerButton,
  onCancel,
  onAgree,
  onClickInsider,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);

  return (
    <div onClick={() => onClickInsider && onClickInsider()}>
      {triggerButton(() => setOpen(true))}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: "20px",
            padding: "8px",
            maxWidth: "360px",
            width: "100%",
            boxShadow: "0 24px 60px rgba(30,40,55,0.18)",
          },
        }}
      >
        {/* Icon */}
        <div className="flex justify-center pt-6 pb-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1F1]">
            <IoLogOutOutline size={30} className="text-[#E53935]" />
          </div>
        </div>

        {/* Title */}
        <div className="px-6 pt-2 text-center">
          <h2 className="text-[18px] font-bold text-[#20242B]">{dialogTitle}</h2>
        </div>

        {/* Body */}
        <div className="px-6 pt-2 pb-6 text-center">
          <p className="text-[13.5px] leading-relaxed text-[#7C8592]">{dialogDetails}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              onCancel && onCancel();
            }}
            className="flex-1 rounded-[12px] border border-[#E4E8ED] bg-white py-2.5 text-sm font-semibold text-[#68717F] transition hover:bg-[#F1F2F4]"
          >
            {CancelButton}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              onAgree && onAgree();
            }}
            className="flex-1 rounded-[12px] bg-[#E53935] py-2.5 text-sm font-semibold text-white transition hover:bg-[#C62828]"
          >
            {AgreeButtonValue}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
