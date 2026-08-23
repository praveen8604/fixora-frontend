import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { FiCalendar, FiChevronDown } from "react-icons/fi";

const OverviewDate = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = value || dayjs();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isToday = selected.isSame(dayjs(), "day");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="relative" ref={rootRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2.5 rounded-lg border border-[#E6EAF0] bg-white px-3 py-2 text-left transition-colors hover:border-[#C9D2E3]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F4F7FE] text-[#50589C]">
            <FiCalendar className="h-4 w-4" />
          </span>
          <span className="pr-1">
            <span className="block text-[11px] text-[#64748B]">
              {isToday ? "Today" : selected.format("dddd")}
            </span>
            <span className="block text-sm font-medium text-[#1B2559]">
              {selected.format("D MMM YYYY")}
            </span>
          </span>
          <FiChevronDown
            className={`h-4 w-4 text-[#94A3B8] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_12px_32px_rgba(33,30,39,0.12)]">
            <DateCalendar
              value={selected}
              onChange={(next) => {
                onChange?.(next);
                setOpen(false);
              }}
              maxDate={dayjs()}
              sx={{
                "& .MuiPickersDay-root.Mui-selected": {
                  backgroundColor: "#50589C",
                  "&:hover": { backgroundColor: "#50589C" },
                },
                "& .MuiPickersDay-today": {
                  borderColor: "#50589C",
                },
                "& .MuiPickersYear-yearButton.Mui-selected": {
                  backgroundColor: "#50589C",
                },
              }}
            />
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default OverviewDate;
