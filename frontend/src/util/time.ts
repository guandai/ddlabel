export const toUpdateTime = (time: number) => {
	if (!time) {
		return 'N/A';
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
