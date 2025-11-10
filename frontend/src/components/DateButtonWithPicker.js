import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateButtonWithPicker = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    const month = date.toLocaleString("default", { month: "long" });
    const weekday = date.toLocaleString("default", { weekday: "short" });
    const day = date.getDate();
    const getSuffix = (d) => {
      if (d >= 11 && d <= 13) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    return `${month} ${weekday} ${day}${getSuffix(day)}`;
  };

  const handleChange = (date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleChange}
      minDate={new Date()}
      popperPlacement="bottom-start" // opens below the button
      customInput={
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: "500",
            backgroundColor: "#fff",
            border: "1.5px solid #f97316",
            borderRadius: "25px",
            color: "#f97316",
            cursor: "pointer",
            padding: "8px 14px",
            justifyContent: "flex-start",
          }}
        >
          {formatDate(selectedDate)}
        </button>
      }
    />
  );
};

export default DateButtonWithPicker;








