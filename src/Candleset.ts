import type TradingPair from './TradingPair'
import type Candle from './Candle'
import type CandleInterval from './CandleInterval'

/**
 * Represents a group of candles for a specific trading pair on a specific interval
 */
class Candleset
{
	/**
	 * Create a new Candleset, with the given CandleInterval, TradingPair, and candles
	 * @param interval The interval the candles were collected on
	 * @param pair The trading pair of the candles
	 * @param candles The candles to put in this Candleset
	 */
	public constructor(public readonly interval: CandleInterval, public readonly pair: TradingPair,
		private readonly _candles: Candle[] = [])
	{}

	/**
	 * Get the candles in this Candleset
	 * @returns The candles in this Candleset
	 */
	public get candles(): readonly Candle[]
	{
		return this._candles
	}

	/**
	 * Get the name of this candle set
	 */
	public get name(): string
	{
		return `${this.pair.base}_${this.pair.trade}_${this.interval.toString()}`
	}

	/**
	 * Adds the given candle to this Candleset, maintaining the sorted order of all candles
	 * @param candle The candle to add
	 */
	public addCandle(candle: Candle): void
	{
		// Insert using binary search
		let low = 0, high = this._candles.length

		while (low < high)
		{
			const mid = Math.floor((low + high) / 2)

			if (this._candles[mid].date.valueOf() < candle.date.valueOf())
				low = mid + 1
			else
				high = mid
		}

		this._candles.splice(low, 0, candle)
	}
}

export default Candleset
