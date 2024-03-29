
import moment from 'moment'
import Candle from '../src/Candle'
import CandleInterval, { IntervalUnit } from '../src/CandleInterval'
import Candleset from '../src/Candleset'
import HistDataStore from '../src/HistDataStore'

class TestHistDataStore extends HistDataStore
{
	public readonly tmpCandleStore: Candleset[] = []

	public storeCandles(candles: Candleset): Promise<void>
	{
		this.tmpCandleStore.push(candles)
		return Promise.resolve()
	}
}

describe('HistDataStore', () =>
{
	test('should be of type HistDataStore', () =>
	{
		const source = new TestHistDataStore()
		expect(source).toBeInstanceOf(HistDataStore)
	})
})

describe('HistDataStore.storeCandles', () =>
{
	test('should be able to store candles', async() =>
	{
		const source = new TestHistDataStore()
		const candleset = new Candleset(new CandleInterval(IntervalUnit.MINUTE, 1), { base: 'BTC', trade: 'USDT' })
		const candle1 = new Candle(moment(), 0, 0, 0, 0, 0)
		const candle2 = new Candle(candle1.date.clone().add(1, 'minute'), 1, 1, 1, 1, 1)
		candleset.addCandle(candle1)
		candleset.addCandle(candle2)
		await source.storeCandles(candleset)
		expect(source.tmpCandleStore.length).toBe(1)
		expect(source.tmpCandleStore[0].candles.length).toBe(2)
		expect(source.tmpCandleStore[0].candles[0].open).toBe(0)
		expect(source.tmpCandleStore[0].candles[1].open).toBe(1)
	})
})

describe('HistDataStore.storeCandleStream', () =>
{
	test('should be able to store candles', async() =>
	{
		const source = new TestHistDataStore()
		const candleset = new Candleset(new CandleInterval(IntervalUnit.MINUTE, 1), { base: 'BTC', trade: 'USDT' })

		const stream = new ReadableStream<Candle>({
			start(controller): void
			{
				const candle1 = new Candle(moment(), 0, 0, 0, 0, 0)
				const candle2 = new Candle(candle1.date.clone().add(1, 'minute'), 1, 1, 1, 1, 1)
				controller.enqueue(candle1)
				controller.enqueue(candle2)
				controller.close()
			},
		})

		await source.storeCandleStream(stream, candleset)
		expect(source.tmpCandleStore.length).toBe(1)
		expect(source.tmpCandleStore[0].candles.length).toBe(2)
		expect(source.tmpCandleStore[0].candles[0].open).toBe(0)
		expect(source.tmpCandleStore[0].candles[1].open).toBe(1)
	})
})
