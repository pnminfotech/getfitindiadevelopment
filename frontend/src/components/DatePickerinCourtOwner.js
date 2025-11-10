import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { FaRegCalendarAlt, FaChevronDown } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const formatDate = (date) => {
  if (!date || isNaN(new Date(date))) return "Select Date";
  const day = date.getDate();                               // 5
  const month = date.toLocaleString("en-GB", { month: "short" }); // Nov
  const weekday = date.toLocaleString("en-GB", { weekday: "short" }); // Wed
  const year = date.getFullYear();                          // 2025
  return `${day} ${month}, ${weekday}, ${year}`;            // 5 Nov, Wed, 2025
};

const CustomInput = forwardRef(({ onClick, display }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    type="button"
    className="flex items-center gap-2 bg-transparent px-2 py-1 text-sm text-gray-800 hover:text-[#0d2149] transition-all"
  >
    <FaRegCalendarAlt className="text-[#0d2149]" size={14} />
    <span className="font-medium">{display}</span>
    <FaChevronDown className="text-gray-600" size={12} />
  </button>
));
export default function DatePickerinCourtOwner({
  date,
  onDateChange,
  minDate,
  popperContainer,
  portalId,
}) {
  const safeDate = date && !isNaN(new Date(date)) ? new Date(date) : new Date();

  return (
    <DatePicker
      selected={safeDate}
      onChange={(d) => d && onDateChange(d)}
      minDate={minDate}
      // 👇 Use our own display string; ignore the injected `value`
      customInput={<CustomInput display={formatDate(safeDate)} />}
      popperPlacement="bottom-start"
      shouldCloseOnSelect
      showPopperArrow={false}
      calendarStartDay={1}
      popperClassName="z-[9999]"
      // `dateFormat` no longer matters for the button text
      dateFormat="dd-MM-yyyy"
      popperContainer={popperContainer}
      portalId={portalId || "date-portal-root"}
    />
  );
}
