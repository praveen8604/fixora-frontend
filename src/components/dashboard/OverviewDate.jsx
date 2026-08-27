import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  LocalizationProvider,
} from "@mui/x-date-pickers/LocalizationProvider";
import {
  AdapterDayjs,
} from "@mui/x-date-pickers/AdapterDayjs";
import {
  DateCalendar,
} from "@mui/x-date-pickers/DateCalendar";
import {
  FiCalendar,
  FiChevronDown,
} from "react-icons/fi";

const OverviewDate = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selected = value || dayjs();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
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

  const isToday = selected.isSame(dayjs(), "day");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className="relative"
        ref={rootRef}
      >
        {/* =====================================================
            DATE BUTTON
        ====================================================== */}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="
            group
            flex
            items-center
            gap-2.5
            rounded-xl
            border
            border-[#E3CAA5]
            bg-white
            px-3
            py-2
            text-left
            shadow-[0_3px_12px_rgba(92,70,54,0.04)]
            transition-all
            duration-200
            hover:border-[#CEAB93]
            hover:shadow-[0_6px_18px_rgba(92,70,54,0.08)]
          "
        >
          {/* Calendar Icon */}

          <span
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-[#FFFBE9]
              text-[#AD8B73]
              ring-1
              ring-[#E3CAA5]
              transition-all
              duration-200
              group-hover:bg-[#AD8B73]
              group-hover:text-white
              group-hover:ring-[#AD8B73]
            "
          >
            <FiCalendar className="h-4 w-4" />
          </span>

          {/* Date Content */}

          <span className="pr-1">
            <span
              className="
                block
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-[#9A806B]
              "
            >
              {isToday
                ? "Today"
                : selected.format("dddd")}
            </span>

            <span
              className="
                mt-0.5
                block
                text-sm
                font-semibold
                text-[#5C4636]
              "
            >
              {selected.format("D MMM YYYY")}
            </span>
          </span>

          {/* Chevron */}

          <FiChevronDown
            className={`
              h-4
              w-4
              text-[#CEAB93]
              transition-transform
              duration-200
              ${open ? "rotate-180" : ""}
            `}
          />
        </button>

        {/* =====================================================
            CALENDAR DROPDOWN
        ====================================================== */}

        {open && (
          <div
            className="
              absolute
              right-0
              top-[calc(100%+8px)]
              z-50
              overflow-hidden
              rounded-2xl
              border
              border-[#E3CAA5]
              bg-white
              shadow-[0_16px_40px_rgba(92,70,54,0.14)]
            "
          >
            <DateCalendar
              value={selected}
              onChange={(next) => {
                onChange?.(next);
                setOpen(false);
              }}
              maxDate={dayjs()}
              sx={{
                /* Calendar text */

                "& .MuiPickersCalendarHeader-label": {
                  color: "#5C4636",
                  fontWeight: 600,
                },

                "& .MuiPickersCalendarHeader-switchViewButton": {
                  color: "#AD8B73",
                },

                "& .MuiPickersArrowSwitcher-button": {
                  color: "#AD8B73",
                },

                /* Weekday labels */

                "& .MuiDayCalendar-weekDayLabel": {
                  color: "#9A806B",
                  fontWeight: 600,
                },

                /* Normal days */

                "& .MuiPickersDay-root": {
                  color: "#6B503E",
                  borderRadius: "10px",
                },

                "& .MuiPickersDay-root:hover": {
                  backgroundColor: "#FFFBE9",
                },

                /* Selected day */

                "& .MuiPickersDay-root.Mui-selected": {
                  backgroundColor: "#AD8B73",
                  color: "#FFFFFF",
                  fontWeight: 700,
                },

                "& .MuiPickersDay-root.Mui-selected:hover": {
                  backgroundColor: "#AD8B73",
                },

                /* Today */

                "& .MuiPickersDay-today": {
                  borderColor: "#CEAB93",
                  color: "#AD8B73",
                  fontWeight: 700,
                },

                /* Selected + Today */

                "& .MuiPickersDay-today.Mui-selected": {
                  backgroundColor: "#AD8B73",
                  color: "#FFFFFF",
                },

                /* Year selection */

                "& .MuiPickersYear-yearButton": {
                  color: "#6B503E",
                },

                "& .MuiPickersYear-yearButton:hover": {
                  backgroundColor: "#FFFBE9",
                },

                "& .MuiPickersYear-yearButton.Mui-selected": {
                  backgroundColor: "#AD8B73",
                  color: "#FFFFFF",
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