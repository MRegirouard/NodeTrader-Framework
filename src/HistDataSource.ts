import type DataRequest from './DataRequest'
import Candle from './Candle'
import Candleset from './Candleset'
import DataResponseType from './DataResponseType'

/**
 * A source of historical data. This is an abstract class, that ensures that all
 * subclasses implement methods to fulfill DataRequests.
 */
abstract class HistDataSource
{
	/**
	 * Fulfill a DataRequest all at once, returning a promise that resolves with a Candleset and
	 * response type once all data has been fetched.
	 * @param req The DataRequest to fulfill
	 * @returns A promise of Candleset that resolves once all data has been fetched, or rejects if an error occurs. The
	 * promise also resolves with a DataResponseType, indicating whether the request was fulfilled completely or not.
	 */
	public fillRequest(req: DataRequest): Promise<[Candleset, DataResponseType]>
	{
		// Default implementation: make a streamRequest and wait for it to finish

		// Create a candleset to store the candles in
		const candles = new Candleset(req.candleset.interval, req.candleset.pair)

		return new Promise<[Candleset, DataResponseType]>((resolve, reject) =>
		{
			const reader = this.streamRequest(req).getReader()

			// Read candles from the stream until it ends
			reader.read().then(function processCandle(result): Promise<void> | void
			{
				if (result.done)
				{
					// Assume a full response type if the stream did not send a response type
					resolve([ candles, DataResponseType.FullResponse ])
					return
				}

				if (result.value instanceof Candle)
				{
					candles.addCandle(result.value)
					return reader.read().then(processCandle)
				}

				// Resolve with the response type
				resolve([ candles, result.value ])
			}).catch(reject)
		})
	}

	/**
	 * Fulfill a DataRequest with a stream of Candles, sending them immediately as they become available as opposed to
	 * waiting until all candles have been fetched. Candles are gauranteed to come in chronological order, with the
	 * Candle that occurs first in time, first. The stream will end with a DataResponseType, indicating whether the
	 * request was fulfilled completely or not.
	 * @param req The DataRequest to fulfill
	 * @returns A stream with each Candle as it becomes available, and a DataResponseType at the end.
	 */
	public abstract streamRequest(req: DataRequest): ReadableStream<Candle | DataResponseType>
}

export default HistDataSource
