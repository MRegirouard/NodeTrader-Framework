const enum IntervalUnit
	{
	YEAR = 'y',
	MONTH = 'M',
	WEEK = 'w',
	DAY = 'd',
	HOUR = 'h',
	MINUTE = 'm',
}

/**
 * Determine if the given string is a valid interval unit
 * @param unit The unit to check
 * @returns True if the unit is valid, false otherwise
 */
function isValidUnit(unit: string): unit is IntervalUnit
{
	return unit === IntervalUnit.YEAR ||
		unit === IntervalUnit.MONTH ||
		unit === IntervalUnit.WEEK ||
		unit === IntervalUnit.DAY ||
		unit === IntervalUnit.HOUR ||
		unit === IntervalUnit.MINUTE
}

/**
 * Represents the time frame between price candles
 */
class CandleInterval
{
	/**
	 * Create a new CandleInterval from the given unit and amount
	 * @param unit The unit of the interval
	 * @param amount The amount of the interval
	 */
	public constructor(public unit: IntervalUnit, public amount: number)
	{}

	/**
	 * Create a new CandleInterval from the given string
	 * @param interval The string representation of the interval. Must be in the format of <amount><unit>
	 * @returns A new CandleInterval from the parsed string
	 */
	public static fromString(interval: string): CandleInterval
	{
		if (interval.length < 2)
			throw new Error(`Invalid interval string: ${interval}`)

		const unit = interval.slice(-1)
		const amount = parseInt(interval.slice(0, -1))

		if (isNaN(amount) || amount < 1)
			throw new Error(`Invalid interval amount: ${amount}`)

		if (!isValidUnit(unit))
			throw new Error(`Invalid interval unit: ${interval}`)

		return { amount: amount, unit: unit }
	}

	/**
	 * Give a string representation of this interval
	 * @returns A string in the format of <amount><unit>
	 */
	public toString(): string
	{
		return `${this.amount}${this.unit}`
	}
}

export default CandleInterval
export { IntervalUnit }
