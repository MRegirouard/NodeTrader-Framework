import type DataRequest from './DataRequest'
import type Candle from './Candle'
import Candleset from './Candleset'

/**
 * A source of historical data. This is an abstract class, that ensures that all
 * subclasses implement methods to fulfill DataRequests.
 */
abstract class HistDataSource
{
	/**
	 * Fulfill a DataRequest all at once, returning a promise that resolves with a Candleset
	 * once all data has been fetched.
	 * @param req The DataRequest to fulfill
	 * @returns A promise of Candleset that resolves once all data has been fetched, or rejects if an error occurs.
	 */
	public fillRequest(req: DataRequest): Promise<Candleset>
	{
		// Default implementation: make a streamRequest and wait for it to finish

		// Create a candleset to store the candles in
		const candles = new Candleset(req.candleset.interval, req.candleset.pair)

		return new Promise<Candleset>((resolve, reject) =>
		{
			const reader = this.streamRequest(req).getReader()

			// Read candles from the stream until it ends
			reader.read().then(function processCandle(result): Promise<void> | void
			{
				if (result.done)
				{
					resolve(candles)
					return
				}

				candles.addCandle(result.value)
				return reader.read().then(processCandle)
			}).catch(reject)
		})
	}

	/**
	 * Fulfill a DataRequest with a stream of Candles, sending them immediately as they become available as opposed to
	 * waiting until all candles have been fetched. Candles are gauranteed to come in chronological order, with the
	 * Candle that occurs first in time, first.
	 * @param req The DataRequest to fulfill
	 * @returns A stream with each Candle as it becomes available.
	 */
	public abstract streamRequest(req: DataRequest): ReadableStream<Candle>
}

export default HistDataSource
