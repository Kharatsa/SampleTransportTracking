const dayInMillis = (24*60*60*1000)
export const addDaysToDate = (daysToAdd, date) => (new Date(date.getTime() + (daysToAdd*dayInMillis)))
