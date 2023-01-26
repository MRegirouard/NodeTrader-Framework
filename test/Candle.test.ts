import Candle from '../src/Candle'
import moment from 'moment'

describe('Candle', () =>
{
	test('should create a new Candle', () =>
	{
		const date: moment.Moment = moment()
		const open = 15.18
		const high = 15.27
		const low = 15.17
		const close = 15.25
		const volume = 1689

		const candle = new Candle(date, open, high, low, close, volume)
		expect(candle).toBeInstanceOf(Candle)
		expect(candle.date).toBe(date)
		expect(candle.open).toBe(open)
		expect(candle.high).toBe(high)
		expect(candle.low).toBe(low)
		expect(candle.close).toBe(close)
		expect(candle.volume).toBe(volume)
	})
})

describe('Candle.fromArr', () =>
{
	test('should create a new Candle from an array of numbers', () =>
	{
		const date: moment.Moment = moment()
		const open = 15.18
		const high = 15.27
		const low = 15.17
		const close = 15.25
		const volume = 1689

		const candle = Candle.fromArr([ date.valueOf(), open, high, low, close, volume ])
		expect(candle).toBeInstanceOf(Candle)
		expect(candle.date.valueOf()).toBe(date.valueOf())
		expect(candle.open).toBe(open)
		expect(candle.high).toBe(high)
		expect(candle.low).toBe(low)
		expect(candle.close).toBe(close)
		expect(candle.volume).toBe(volume)
	})
})
