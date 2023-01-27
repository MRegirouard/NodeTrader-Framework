import Candleset from '../src/Candleset'
import CandleInterval, { IntervalUnit } from '../src/CandleInterval'
import type TradingPair from '../src/TradingPair'
import moment from 'moment'
import Candle from '../src/Candle'

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
		expect(set.candles).toEqual([ candle1, candle2, candle3 ])
	})
})
