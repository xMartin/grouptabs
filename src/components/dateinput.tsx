import React, { SyntheticEvent, memo } from "react";
import dateUtils from "../util/date";

interface Props {
  date: string;
  onChange: (date: string) => void;
}

const DateInput: React.FC<Props> = ({ date, onChange }) => {
  const handleTodayClick = () => {
    onChange(dateUtils.formatDate(new Date()));
  };

  const handleYesterdayClick = () => {
    var yesterday = dateUtils.addDays(new Date(), -1);
    onChange(dateUtils.formatDate(yesterday));
  };

  const handleDateChange = (event: SyntheticEvent<HTMLInputElement>) => {
    var value = event.currentTarget.value;
    onChange(value);
  };

  return (
    <div className="form-row-input date-input">
      <button
        type="button"
        className={dateUtils.isToday(date) ? "selected" : ""}
        onClick={handleTodayClick}
      >
        today
      </button>
      <button
        type="button"
        className={dateUtils.isYesterday(date) ? "selected" : ""}
        onClick={handleYesterdayClick}
      >
        yesterday
      </button>
      <input type="date" value={date} onChange={handleDateChange} />
    </div>
  );
};

export default memo(DateInput);
