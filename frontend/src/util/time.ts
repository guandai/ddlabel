export const unixTimeToString = (time: number) => {
	if (!time) {
		return '';
	}
	const date = new Date(time);
	const timeZone = "America/New_York";
	// Use Intl.DateTimeFormat to format the date in the specified time zone
	const options = {
		timeZone,
		year: 'numeric' as const,
		month: '2-digit' as const,
		day: '2-digit' as const,
		hour: '2-digit' as const,
		minute: '2-digit' as const,
		second: '2-digit' as const,
		fractionalSecondDigits: 3 as const,
		hour12: false, // Use 24-hour format
	};
	const formatter = new Intl.DateTimeFormat('en-US', options);
	const parts = formatter.formatToParts(date);
	const isoString = `${parts[4].value}-${parts[0].value}-${parts[2].value} ${parts[6].value}:${parts[8].value}`;
	return isoString;
}


export const toDateTime = (date?: string | Date | null, showTime = true): string => {
    // Parse the string into a Date object
	if (!date) return '';
    let dateObject = typeof date === 'string' ? new Date(date) : date;

    // Extract the date components
    let year = dateObject.getUTCFullYear();
    let month = String(dateObject.getMonth() + 1).padStart(2, '0');
    let day = String(dateObject.getDate()).padStart(2, '0');

    // Extract the time components
    let hours = String(dateObject.getHours()).padStart(2, '0');
    let minutes = String(dateObject.getMinutes()).padStart(2, '0');

	const timeString = showTime ? ` ${hours}:${minutes}` : '';
    // Return the formatted date-time string
    return `${year}-${month}-${day}${timeString}`;
}

