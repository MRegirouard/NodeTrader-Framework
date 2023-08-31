import Candleset from '../src/Candleset'
import CandleInterval, { IntervalUnit } from '../src/CandleInterval'
import type TradingPair from '../src/TradingPair'
import moment from 'moment'
import Candle from '../src/Candle'

function expectSorted(candles: readonly Candle[]): void
{
	for (let i = 1; i < candles.length; i++)
		expect(candles[i].date.valueOf()).toBeGreaterThanOrEqual(candles[i - 1].date.valueOf())
}

describe('Candleset', () =>
{
	test('should be able to create a Candleset', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const set = new Candleset(interval, pair)

		expect(set).toBeInstanceOf(Candleset)
		expect(set.interval).toBe(interval)
		expect(set.pair).toBe(pair)
		expect(set.candles).toEqual([])
	})
})

describe('Candleset.name', () =>
{
	test('should return the name of the Candleset', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const set = new Candleset(interval, pair)

		expect(set.name).toBe('USDT_BTC_1m')
	})
})

describe('Candleset.addCandle', () =>
{
	test('should add a candle to the Candleset', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const set = new Candleset(interval, pair)

		expect(set.candles).toEqual([])

		const candle = new Candle(moment(), 22.45, 22.71, 22.41, 22.58, 148)
		set.addCandle(candle)

		expect(set.candles).toHaveLength(1)
		expect(set.candles).toEqual([candle])
	})

	test('should add multiple candles to the Candleset', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const set = new Candleset(interval, pair)

		expect(set.candles).toEqual([])

		const candle1 = new Candle(moment(), 22.45, 22.71, 22.41, 22.58, 148)
		const candle2 = new Candle(moment(), 22.58, 22.71, 22.41, 22.45, 148)
		const candle3 = new Candle(moment(), 22.41, 22.71, 22.45, 22.58, 148)
		set.addCandle(candle1)
		set.addCandle(candle2)
		set.addCandle(candle3)

		expect(set.candles).toHaveLength(3)
		expect(set.candles).toContain(candle1)
		expect(set.candles).toContain(candle2)
		expect(set.candles).toContain(candle3)
	})

	test('should maintain the candles in sorted order when adding earlier candles', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const set = new Candleset(interval, pair)

		expect(set.candles).toEqual([])
		expectSorted(set.candles)

		const candle1 = new Candle(moment(), 22.45, 22.71, 22.41, 22.58, 148)
		const candle2 = new Candle(candle1.date.clone().subtract(1, 'minute'), 22.58, 22.71, 22.41, 22.45, 148)
		const candle3 = new Candle(candle2.date.clone().subtract(1, 'minute'), 22.41, 22.71, 22.45, 22.58, 148)

		set.addCandle(candle1)
		expectSorted(set.candles)
		set.addCandle(candle2)
		expectSorted(set.candles)
		set.addCandle(candle3)
		expectSorted(set.candles)
	})

	test('should maintain the candles in sorted order when adding later candles', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const set = new Candleset(interval, pair)

		expect(set.candles).toEqual([])
		expectSorted(set.candles)

		const candle1 = new Candle(moment(), 22.45, 22.71, 22.41, 22.58, 148)
		const candle2 = new Candle(candle1.date.clone().add(1, 'minute'), 22.58, 22.71, 22.41, 22.45, 148)
		const candle3 = new Candle(candle2.date.clone().add(1, 'minute'), 22.41, 22.71, 22.45, 22.58, 148)

		set.addCandle(candle1)
		expectSorted(set.candles)
		set.addCandle(candle2)
		expectSorted(set.candles)
		set.addCandle(candle3)
		expectSorted(set.candles)
	})

	test('should maintain the candles in sorted order when adding candles in the middle', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const set = new Candleset(interval, pair)

		expect(set.candles).toEqual([])
		expectSorted(set.candles)

		const firstCandle = new Candle(moment(), 22.45, 22.71, 22.41, 22.58, 148)
		const lastCandle = new Candle(firstCandle.date.clone().add(10, 'minute'), 22.41, 22.71, 22.45, 22.58, 148)

		set.addCandle(firstCandle)
		expectSorted(set.candles)
		set.addCandle(lastCandle)
		expectSorted(set.candles)

		for (let i = 1; i < 10; i++)
		{
			const candle = new Candle(firstCandle.date.clone().add(i, 'minute'), 22.58, 22.71, 22.41, 22.45, 148)
			set.addCandle(candle)
			expectSorted(set.candles)
		}
	})

	test('should always maintain the candles in sorted order', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const set = new Candleset(interval, pair)

		expect(set.candles).toEqual([])
		expectSorted(set.candles)

		for (let i = 0; i < 100; i++)
		{
			const candle = new Candle(moment(), Math.random(), Math.random(),
				Math.random(), Math.random(), Math.random())
			set.addCandle(candle)
			expectSorted(set.candles)
		}
	})
})
