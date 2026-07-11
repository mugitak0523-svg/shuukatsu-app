const JST_OFFSET_MINUTES = 9 * 60;
const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;

export function getJstDateKey(date = new Date()) {
  return formatJstDateKey(date);
}

export function formatJstDateKey(date: Date) {
  const jstDate = new Date(date.getTime() + JST_OFFSET_MINUTES * MINUTE_MS);
  return [
    jstDate.getUTCFullYear(),
    String(jstDate.getUTCMonth() + 1).padStart(2, "0"),
    String(jstDate.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function formatJstTime(date: Date) {
  const jstDate = new Date(date.getTime() + JST_OFFSET_MINUTES * MINUTE_MS);
  return [
    String(jstDate.getUTCHours()).padStart(2, "0"),
    String(jstDate.getUTCMinutes()).padStart(2, "0"),
  ].join(":");
}

export function formatJstDateTimeLocal(date: Date) {
  return `${formatJstDateKey(date)}T${formatJstTime(date)}`;
}

export function parseJstDateTimeLocal(value: string) {
  const [datePart, timePart = "00:00"] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  return new Date(
    Date.UTC(year, month - 1, day, hour, minute) -
      JST_OFFSET_MINUTES * MINUTE_MS,
  );
}

export function parseJstDateStart(value: string) {
  return parseJstDateTimeLocal(`${value}T00:00`);
}

export function parseJstDateEnd(value: string) {
  return new Date(parseJstDateStart(value).getTime() + DAY_MS);
}

export function addJstDays(dateKey: string, days: number) {
  const date = parseJstDateStart(dateKey);
  return formatJstDateKey(new Date(date.getTime() + days * DAY_MS));
}

export function getJstMonthMatrix(year: number, month: number) {
  const firstDate = new Date(Date.UTC(year, month - 1, 1));
  const nextMonthDate = new Date(Date.UTC(year, month, 1));
  const firstDay = firstDate.getUTCDay();
  const daysInMonth = Math.round(
    (nextMonthDate.getTime() - firstDate.getTime()) / DAY_MS,
  );
  const visibleDays = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const gridStart = new Date(firstDate.getTime() - firstDay * DAY_MS);

  return Array.from({ length: visibleDays }, (_, index) => {
    const date = new Date(gridStart.getTime() + index * DAY_MS);
    return {
      dateKey: [
        date.getUTCFullYear(),
        String(date.getUTCMonth() + 1).padStart(2, "0"),
        String(date.getUTCDate()).padStart(2, "0"),
      ].join("-"),
      day: date.getUTCDate(),
      inMonth: date.getUTCMonth() + 1 === month,
    };
  });
}

export function getJstWeekDays(dateKey: string) {
  const [year, month, dayOfMonth] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, dayOfMonth));
  const day = date.getUTCDay();
  const start = new Date(date.getTime() - day * DAY_MS);

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(start.getTime() + index * DAY_MS);
    return {
      dateKey: [
        current.getUTCFullYear(),
        String(current.getUTCMonth() + 1).padStart(2, "0"),
        String(current.getUTCDate()).padStart(2, "0"),
      ].join("-"),
      day: current.getUTCDate(),
    };
  });
}
