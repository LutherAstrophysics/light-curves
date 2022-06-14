import {format} from 'date-fns'

export function myDateFormatString(myDate) {
    return format(myDate, 'yyyy-MM-dd');
}
