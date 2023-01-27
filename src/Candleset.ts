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
		public readonly candles: Candle[] = [])
	{}

	/**
	 * Get the name of this candle set
	 */
	public get name(): string
	{
		return `${this.pair.base}_${this.pair.trade}_${this.interval.toString()}`
	}

	/**
	 * Adds the given candle to this Candleset
	 * @param candle The candle to add
	 */
	public addCandle(candle: Candle): void
	{
		this.candles.push(candle)
	}
}

export default Candleset
