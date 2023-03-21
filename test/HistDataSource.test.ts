import HistDataSource from '../src/HistDataSource'
import CandleInterval, { IntervalUnit } from '../src/CandleInterval'
import Candleset from '../src/Candleset'
import DataRequest from '../src/DataRequest'
import Candle from '../src/Candle'
import moment from 'moment'

class MyTestDataSource extends HistDataSource
{
	/* eslint class-methods-use-this: "off"*/
	public streamRequest(req: DataRequest): ReadableStream<Candle>
	{
		return new ReadableStream<Candle>({
			start(controller): void
			{
				let remaining: number = req.count ?? 0

				const interval = setInterval(() =>
				{
					if (remaining <= 0)
					{
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
		const candleset = new Candleset(new CandleInterval(IntervalUnit.MINUTE, 1), { base: 'BTC', trade: 'USD' })
		const dataRequest = DataRequest.endCountRequest(candleset, 10, moment())
		let count = 0
		const reader = source.streamRequest(dataRequest).getReader()
		await expect(reader.read().then(function processCandle({ done, value }): Promise<void> | void
		{
			expect((done || count < 10) && (!done || count === 10)).toBe(true)

			if (done)
				return

			expect(count).toBeLessThan(10)
			expect(value).toBeDefined()
			expect(value).toBeInstanceOf(Candle)
			count++
			return reader.read().then(processCandle)
		})).resolves.toBeUndefined()

		expect(count).toBe(10)
	})
})

describe('HistDataSource.fillRequest', () =>
{
	test('should be able to fullfill a fillRequest', async() =>
	{
		const source = new MyTestDataSource()
		const candleset = new Candleset(new CandleInterval(IntervalUnit.MINUTE, 1), { base: 'BTC', trade: 'USD' })
		const dataRequest = DataRequest.endCountRequest(candleset, 10, moment())
		const response = source.fillRequest(dataRequest)
		await expect(response).resolves.toBeInstanceOf(Candleset)
		await expect(response.then((set) => set.candles.length)).resolves.toBe(10)
	})
})
