import {
  format,
  max,
  min,
  isAfter,
  isBefore,
  isSameDay,
  differenceInDays,
} from "date-fns";

export const myDateFormat = "yyyy-MM-dd";

export function myDateFormatString(myDate) {
  return format(myDate, myDateFormat);
}

export function isSameDateOrAfterDateString(dateA, dateB) {
  // returns if dateA is same or after dateB
  return (
    isAfter(new Date(dateA), new Date(dateB)) ||
    isSameDay(new Date(dateA), new Date(dateB))
  );
}

export function isBeforeDateString(dateA, dateB) {
  // returns if dateA is before dateB
  return isBefore(new Date(dateA), new Date(dateB));
}

export function isBeforeOrEqualToDateString(dateA, dateB) {
  // returns if dateA is before or equal to dateB
  return (
    isBefore(new Date(dateA), new Date(dateB)) ||
    isSameDay(new Date(dateA), new Date(dateB))
  );
}
export function isDateBetween(dateString, dateA, dateB) {
  const myDate = new Date(dateString);
  const maxDate = max([new Date(dateA), new Date(dateB)]);
  const minDate = min([new Date(dateA), new Date(dateB)]);
  return isAfter(myDate, minDate) && isBefore(myDate, maxDate);
}

export function minDateForChartZoom() {
  return new Date("2001-01-01").getTime();
}

export function millisecondsInAYear() {
  return 1000 * 60 * 60 * 24 * 365;
}

export function constructDate(dateString) {
  if (dateString.replace) return new Date(dateString.replace(/-/g, "/"));
  return new Date(dateString);
}

export function daysSinceBeginning(dateString) {
  const beginningDate = constructDate("2003-06-18");
  const myDate = constructDate(dateString);
  return differenceInDays(myDate, beginningDate);
}
