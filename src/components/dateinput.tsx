import { FunctionComponent, SyntheticEvent, memo } from "react";
import { formatDate, addDays, isToday, isYesterday } from "../util/date";

interface Props {
  date: string;
  onChange: (date: string) => void;
}

const DateInput: FunctionComponent<Props> = ({ date, onChange }) => {
  const handleTodayClick = () => {
    onChange(formatDate(new Date()));
  };

  const handleYesterdayClick = () => {
    const yesterday = addDays(new Date(), -1);
    onChange(formatDate(yesterday));
  };

  const handleDateChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    onChange(value);
  };

  return (
    <div className="form-row-input date-input">
      <button
        type="button"
        className={isToday(date) ? "selected" : ""}
        onClick={handleTodayClick}
      >
        today
      </button>
      <button
        type="button"
        className={isYesterday(date) ? "selected" : ""}
        onClick={handleYesterdayClick}
      >
        yesterday
      </button>
      <input type="date" value={date} onChange={handleDateChange} />
    </div>
  );
};

export default memo(DateInput);
