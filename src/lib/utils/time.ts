/**
 * Returns a Date object representing a time either in the future, past, or the current time.
 *
 * @param {('future' | 'current' | 'past')} [direction='current'] - Determines whether the function calculates a date in the future, past, or returns the current date.
 * @param {('ms' | 's' | 'm' | 'h')} [timeUnit] - The unit of time to adjust by. Can be milliseconds ('ms'), seconds ('s'), minutes ('m'), or hours ('h').
 * @param {number} [timeAmount] - The amount of time to adjust the current date by. Must be a positive number.
 *
 * @returns {Date} - A Date object representing the calculated time.
 *
 * @example
 * // Returns the current date and time
 * const now = getDate();
 *
 * @example
 * // Returns a date 5 minutes in the future
 * const futureDate = getDate('future', 'm', 5);
 *
 * @example
 * // Returns a date 2 hours in the past
 * const pastDate = getDate('past', 'h', 2);
 *
 * @throws Will log an error if the timeAmount is negative.
 */
export const getDate = (
	direction: 'future' | 'current' | 'past' = 'current',
	timeUnit?: 'ms' | 's' | 'm' | 'h',
	timeAmount?: number,
): Date => {
	const currentTime = Date.now(); // Current time in milliseconds

	if (direction === 'current' || !timeAmount || !timeUnit) {
		return new Date(currentTime);
	}
	if (timeAmount < 0) {
		console.error('Time amount must be a positive number');
	}

	const multiplier: number = direction === 'past' ? -1 : 1;
	let timeToAddInMilliseconds = 0;
	switch (timeUnit) {
		case 'ms': // Milliseconds
			timeToAddInMilliseconds = timeAmount;
			break;
		case 's': // Convert seconds to milliseconds
			timeToAddInMilliseconds = timeAmount * 1000;
			break;
		case 'm': // Convert minutes to milliseconds
			timeToAddInMilliseconds = timeAmount * 60000;
			break;
		case 'h': // Convert hours to milliseconds
			timeToAddInMilliseconds = timeAmount * 3600000;
			break;
	}

	return new Date(currentTime + timeToAddInMilliseconds * multiplier);
};
