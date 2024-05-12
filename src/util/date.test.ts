import { formatHumanDateAndTime } from "./date";

describe("formatHumanDateAndTime", () => {
  it("returns full date and time for dates before yesterday", () => {
    const now = new Date();
    const todayMS = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    // day before yesterday
    const d = new Date(todayMS - 2 * 24 * 60 * 60 * 1000);

    const expectedDateString = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} 12:00:00 AM`;

    expect(formatHumanDateAndTime(d)).toBe(expectedDateString);
  });

  it("returns 'today' and the time for a date of today", () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const expectedDateString = `today 12:00:00 AM`;

    expect(formatHumanDateAndTime(today)).toBe(expectedDateString);
  });

  it("returns 'yesterday' and the time for a date of yesterday", () => {
    const now = new Date();
    const todayMS = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const yesterday = new Date(todayMS - 1 * 24 * 60 * 60 * 1000);

    const expectedDateString = `yesterday 12:00:00 AM`;

    expect(formatHumanDateAndTime(yesterday)).toBe(expectedDateString);
  });
});
