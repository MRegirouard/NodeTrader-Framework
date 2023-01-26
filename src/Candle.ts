import moment from 'moment'

/**
 * Represents a pair price candle for a certain interval
 */
class Candle
{
	/**
	 * Create a new Candle with the given parameters
	 * @param date The start date of the candle
	 * @param open The open price of the candle
	 * @param high The highest price of the candle
	 * @param low The lowest price of the candle
	 * @param close The closing price of the candle
	 * @param volume The volume traded during the candle
	 */
	public constructor(public readonly date: moment.Moment, public readonly open: number,
		public readonly high: number, public readonly low: number,
		public readonly close: number, public readonly volume: number)
	{}

	/**
	 * Creates a new Candle from an array of numbers
	 * @param arr The array of numbers to create the candle from, in the following order:
	 * [date (in milliseconds), open, high, low, close, volume]
	 * @returns The new Candle
	 */
	public static fromArr(arr: [number, number, number, number, number, number]): Candle
	{
		return new Candle(moment(arr[0]), arr[1], arr[2], arr[3], arr[4], arr[5])
	}
}

export default Candle
