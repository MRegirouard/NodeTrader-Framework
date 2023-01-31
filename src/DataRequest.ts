import type moment from 'moment'
import type Candleset from './Candleset'

/**
 * Represents an internal data request, with options for retrieval
 */
class DataRequest
{
	private _startDate?: moment.Moment // The start date of the request, inclusive
	private _endDate?: moment.Moment // The end date of the request, inclusive
	private _count?: number // The number of candles to fetch
	private _randomCount?: number // The number of randomly selected candles to get from all retrieved data

	private constructor(public readonly candleset: Candleset)
	{}

	/**
	 * Get the start date of this DataRequest, the first candle that will be fetched
	 */
	public get startDate(): moment.Moment | undefined
	{
		return this._startDate
	}

	/**
	 * Get the end date of this DataRequest, the last candle that will be fetched
	 */
	public get endDate(): moment.Moment | undefined
	{
		return this._endDate
	}

	/**
	 * Get the number of candles that will be fetched
	 */
	public get count(): number | undefined
	{
		return this._count
	}

	/**
	 * Get the number of random candles to fetch
	 */
	public get randomCount(): number | undefined
	{
		return this._randomCount
	}

	/**
	 * Create a new DataRequest that will fetch all candles between the start and end dates
	 * @param startDate The date of the first candle
	 * @param endDate The date of the last candle
	 * @returns The range-based DataRequest
	 */
	public static dateRangeRequest(candleset: Candleset, startDate: moment.Moment, endDate: moment.Moment): DataRequest
	{
		if (endDate.isBefore(startDate))
			throw new Error('End date must be the same as or after start date.')

		const request = new DataRequest(candleset)
		request._startDate = startDate
		request._endDate = endDate
		return request
	}

	/**
	 * Create a new DataRequest that will fetch a number of candles after the given date
	 * @param startDate The date of the first candle
	 * @param count The number of candles to retrieve
	 * @returns The count-based DataRequest
	 */
	public static startCountRequest(candleset: Candleset, startDate: moment.Moment, count: number): DataRequest
	{
		if (count < 0)
			throw new Error('The number of candles to retrieve must be greater than or equal to 0.')

		const request = new DataRequest(candleset)
		request._startDate = startDate
		request._count = count
		return request
	}

	/**
	 * Create a new DataRequest that will fetch a number of candles before the given date
	 * @param count The number of candles to retrieve
	 * @param endDate The date of the last candle
	 * @returns The count-based DataRequest
	 */
	public static endCountRequest(candleset: Candleset, count: number, endDate: moment.Moment): DataRequest
	{
		if (count < 0)
			throw new Error('The number of candles to retrieve must be greater than or equal to 0.')

		const request = new DataRequest(candleset)
		request._count = count
		request._endDate = endDate
		return request
	}

	/**
	 * Estimate the end date of this DataRequest. This will be the expected date of the last candle in a given set.
	 */
	public estimateEndDate(): moment.Moment
	{
		if (this.startDate == null)
			throw new Error('Cannot estimate end date of a DataRequest without a start date.')

		if (this.count == null)
			throw new Error('Cannot estimate end date of a DataRequest without a count.')

		const end: moment.Moment = this.startDate.clone()
		return end.add(this.count, this.candleset.interval.unit)
	}

	public estimateStartDate(): moment.Moment
	{
		if (this.endDate == null)
			throw new Error('Cannot estimate start date of a DataRequest without an end date.')

		if (this.count == null)
			throw new Error('Cannot estimate start date of a DataRequest without a count.')

		const start: moment.Moment = this.endDate.clone()
		return start.subtract(this.count, this.candleset.interval.unit)
	}

	public estimateCount(): number
	{
		if (this.startDate == null)
			throw new Error('Cannot estimate count of a DataRequest without a start date.')

		if (this.endDate == null)
			throw new Error('Cannot estimate count of a DataRequest without an end date.')

		return this.endDate.diff(this.startDate, this.candleset.interval.unit)
	}

	/**
	 * Make this DataRequest a random request, giving a random but consecutive selection of data from all of
	 * the data retrieved.
	 * @param randomCount The size of the consecutive random selection, the number of candles
	 */
	public random(randomCount: number): void
	{
		if (this.count != null && randomCount > this.count)
			throw new Error('Random data count must be less than or equal to data count')

		this._randomCount = randomCount
	}

	/**
	 * Give a human-readable string representing this data request, showing the type of request and
	 * the specifications.
	 * @returns A string representing this DataRequest.
	 */
	public toString(): string
	{
		let str: string

		if (this._randomCount == null)
			str = 'Request of'
		else
			str = `Random request of ${this._randomCount} candles from`

		if (this.startDate != null)
		{
			if (this.endDate != null) // Date Range
				return `${str} candles between dates ${this.startDate.toISOString()} and ${this.endDate.toISOString()}`

			if (this.count == null) // Illegal request (no end date or count)
				return `${str} unknown number of candles after the date ${this.startDate.toISOString()}`

			// Start Count
			return `${str} first ${this.count} candles after the date ${this.startDate.toISOString()}`
		}

		if (this.endDate == null) // Illegal request (no start date or end date)
			return `${str} unknown number of candles between unknown dates`

		if (this.count == null) // Illegal request (no start date or count)
			return `${str} unknown number of candles before the date ${this.endDate.toISOString()}`

		// End Count
		return `${str} last ${this.count} candles before the date ${this.endDate.toISOString()}`
	}
}

export default DataRequest
export { DataRequest }
