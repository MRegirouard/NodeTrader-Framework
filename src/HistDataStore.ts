import type Candle from './Candle'
import Candleset from './Candleset'
import CandleInterval from './CandleInterval'

/**
 * A storage for historical data. This is an abstract class, that ensures that all
 * subclasses implement methods to store Candlesets or Candle streams.
 */
abstract class HistDataStore
{
	/**
	 * Store a stream of Candles in the database.
	 * @param stream The stream of Candles to store.
	 * @param set The Candleset that holds the interval and trading pair information for the candles.
	 * @returns A promise that resolves once all candles have been stored, or rejects if an error occurs.
	 */
	public storeCandleStream(stream: ReadableStream<Candle>, set: Candleset): Promise<void>
	{
		return new Promise<void>((resolve, reject) =>
		{
			const reader = stream.getReader()

			// Make a copy of the candleset, so we can add candles to it
			const candles: Candleset = new Candleset(new CandleInterval(set.interval.unit, set.interval.amount),
				{ base: set.pair.base, trade: set.pair.trade })

			// Must bind this to the function, otherwise it will be called with the wrong this
			const storeFunc = this.storeCandles.bind(this)

			// Read candles from the stream until it ends
			reader.read().then(function processCandle(result): Promise<void> | void
			{
				if (result.done)
				{
					storeFunc(candles).then(resolve).catch(reject)
					resolve()
					return
				}

				candles.addCandle(result.value)
				return reader.read().then(processCandle)
			}).catch(reject)
		})
	}

	/**
	 * Store a Candleset in the database.
	 * @param candles The Candleset to store.
	 */
	public abstract storeCandles(candles: Candleset): Promise<void>
}

export default HistDataStore
