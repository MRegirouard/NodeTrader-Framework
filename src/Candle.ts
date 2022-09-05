import moment from "moment"

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
	constructor(public readonly date: moment.Moment, public readonly open: number,
		public readonly high: number, public readonly low: number,
		public readonly close: number, public readonly volume: number)
	{}
}

export default Candle
