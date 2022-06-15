import {format, max, min, isAfter, isBefore} from 'date-fns'

export function myDateFormatString(myDate) {
    return format(myDate, 'yyyy-MM-dd');
}

export function isDateBetween(dateString, dateA, dateB) {
    const myDate = new Date(dateString) 
    const maxDate = max([new Date(dateA), new Date(dateB)])
    const minDate = min([new Date(dateA), new Date(dateB)])
    return isAfter(myDate, minDate) && isBefore(myDate, maxDate);
}

export function minDateForChartZoom() {
    return new Date("2001-01-01").getTime()
}

export function millisecondsInAYear() {
    return 1000 * 60 * 60 * 24 * 365
}
