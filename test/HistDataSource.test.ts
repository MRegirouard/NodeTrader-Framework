import HistDataSource from '../src/HistDataSource'
import CandleInterval, { IntervalUnit } from '../src/CandleInterval'
import Candleset from '../src/Candleset'
import DataRequest from '../src/DataRequest'
import Candle from '../src/Candle'
import moment from 'moment'
import DataResponseType from '../src/DataResponseType'

class MyTestDataSource extends HistDataSource
{
	// Flag for testing, wether to respond with a full or partial request
	public doFullRequest = true

	// Flag for testing, wether to respond with a response type or not
	public sendResponseType = true

	public streamRequest(req: DataRequest): ReadableStream<Candle | DataResponseType>
	{
		const doFullRequest = this.doFullRequest
		const sendResponseType = this.sendResponseType

		return new ReadableStream<Candle | DataResponseType>({
			start(controller): void
			{
				let remaining: number = req.count ?? 0

				if (!doFullRequest)
					remaining /= 2

				const interval = setInterval(() =>
				{
					if (remaining <= 0)
					{
						if (sendResponseType)
						{
							if (doFullRequest)
								controller.enqueue(DataResponseType.FullResponse)
							else
								controller.enqueue(DataResponseType.PartialResponse)
						}

						controller.close()
						clearInterval(interval)
					}
					else
					{
						controller.enqueue(new Candle(moment(), 0, 0, 0, 0, 0))
						remaining--
					}
				})
			},
		})
	}
}

describe('HistDataSource', () =>
{
	test('should be of type HistDataSource', () =>
	{
		const source = new MyTestDataSource()
		expect(source).toBeInstanceOf(HistDataSource)
	})
})

describe('HistDataSource.streamRequest', () =>
{
	test('should be able to fullfill a streamRequest', async() =>
	{
		const source = new MyTestDataSource()
		source.doFullRequest = true
		source.sendResponseType = true
		const candleset = new Candleset(new CandleInterval(IntervalUnit.MINUTE, 1), { base: 'BTC', trade: 'USD' })
		const dataRequest = DataRequest.endCountRequest(candleset, 10, moment())
		let count = 0
		const reader = source.streamRequest(dataRequest).getReader()
		await expect(reader.read().then(function processCandle({ done, value }): Promise<void> | void
		{
			if (done)
			{
				expect(count).toBe(10)
				return
			}
			else if (value instanceof Candle)
			{
				expect(value).toBeDefined()
				expect(count).toBeLessThan(10)
				count++
			}
			else
			{
				expect(value).toBeDefined()
				expect(count).toBe(10)
				expect(value).toBe(DataResponseType.FullResponse)
			}

			return reader.read().then(processCandle)
		})).resolves.toBeUndefined()

		expect(count).toBe(10)
	})

	test('should be able to fullfill a streamRequest with a partial response', async() =>
	{
		const source = new MyTestDataSource()
		source.doFullRequest = false
		source.sendResponseType = true
		const candleset = new Candleset(new CandleInterval(IntervalUnit.MINUTE, 1), { base: 'BTC', trade: 'USD' })
		const dataRequest = DataRequest.endCountRequest(candleset, 10, moment())
		let count = 0
		const reader = source.streamRequest(dataRequest).getReader()
		await expect(reader.read().then(function processCandle({ done, value }): Promise<void> | void
		{
			if (done)
			{
				expect(count).toBeLessThan(10)
				expect(count).toBeGreaterThan(1)
				return
			}
			else if (value instanceof Candle)
			{
				expect(value).toBeDefined()
				expect(count).toBeLessThan(10)
				count++
			}
			else
			{
				expect(value).toBeDefined()
				expect(count).toBeLessThan(10)
				expect(count).toBeGreaterThan(1)
				expect(value).toBe(DataResponseType.PartialResponse)
			}

			return reader.read().then(processCandle)
		})).resolves.toBeUndefined()

		expect(count).toBeLessThan(10)
	})
})

describe('HistDataSource.fillRequest', () =>
{
	test('should be able to fullfill a fillRequest', async() =>
	{
		const source = new MyTestDataSource()
		source.doFullRequest = true
		source.sendResponseType = true
		const candleset = new Candleset(new CandleInterval(IntervalUnit.MINUTE, 1), { base: 'BTC', trade: 'USD' })
		const dataRequest = DataRequest.endCountRequest(candleset, 10, moment())
		const response = source.fillRequest(dataRequest)
		await expect(response).resolves.toBeInstanceOf(Object)
		await expect(response.then((set) => set[0])).resolves.toBeInstanceOf(Candleset)
		await expect(response.then((set) => set[0].candles.length)).resolves.toBe(10)
		await expect(response.then((set) => set[1])).resolves.toBe(DataResponseType.FullResponse)
	})

	test('should be able to fullfill a fillRequest with a partial response', async() =>
	{
		const source = new MyTestDataSource()
		source.doFullRequest = false
		source.sendResponseType = true
		const candleset = new Candleset(new CandleInterval(IntervalUnit.MINUTE, 1), { base: 'BTC', trade: 'USD' })
		const dataRequest = DataRequest.endCountRequest(candleset, 10, moment())
		const response = source.fillRequest(dataRequest)
		await expect(response).resolves.toBeInstanceOf(Object)
		await expect(response.then((set) => set[0])).resolves.toBeInstanceOf(Candleset)
		await expect(response.then((set) => set[0].candles.length)).resolves.toBeLessThan(10)
		await expect(response.then((set) => set[0].candles.length)).resolves.toBeGreaterThan(1)
		await expect(response.then((set) => set[1])).resolves.toBe(DataResponseType.PartialResponse)
	})

	test('should be able to fullfill a fillRequest when the stream does not send response type', async() =>
	{
		const source = new MyTestDataSource()
		source.doFullRequest = false
		source.sendResponseType = false
		const candleset = new Candleset(new CandleInterval(IntervalUnit.MINUTE, 1), { base: 'BTC', trade: 'USD' })
		const dataRequest = DataRequest.endCountRequest(candleset, 10, moment())
		const response = source.fillRequest(dataRequest)
		await expect(response).resolves.toBeInstanceOf(Object)
		await expect(response.then((set) => set[0])).resolves.toBeInstanceOf(Candleset)
		await expect(response.then((set) => set[0].candles.length)).resolves.toBeLessThan(10)
		await expect(response.then((set) => set[0].candles.length)).resolves.toBeGreaterThan(1)
		await expect(response.then((set) => set[1])).resolves.toBe(DataResponseType.FullResponse)
	})
})
