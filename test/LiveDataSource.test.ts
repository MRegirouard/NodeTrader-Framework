import { LiveDataSource, type CandleSubscriber, type TickerSubscriber } from '../src/LiveDataSource'
import CandleInterval, { IntervalUnit } from '../src/CandleInterval'
import type TradingPair from '../src/TradingPair'
import Candleset from '../src/Candleset'
import Candle from '../src/Candle'
import moment from 'moment'
import type { Ticker } from 'ccxt'

class TestLiveDataSource extends LiveDataSource
{
	private candleObservers: [CandleSubscriber, Candleset][] = []
	private tickerObservers: [TickerSubscriber, TradingPair][] = []
	private readonly candleInt: NodeJS.Timeout
	private readonly tickerInt: NodeJS.Timeout

	public constructor()
	{
		super()

		this.candleInt = setInterval(() =>
		{
			this.candleObservers.forEach((o) => { o[0].onCandle(new Candle(moment(), 0, 0, 0, 0, 0)) })
		}, 20)

		this.tickerInt = setInterval(() =>
		{
			this.tickerObservers.forEach((o) => { o[0].onTicker({ symbol: 'BTC', close: 100000 } as Ticker) })
		}, 20)
	}

	public subscribeCandle(subscription: Candleset, observer: CandleSubscriber): void
	{
		this.candleObservers.push([ observer, subscription ])
	}

	public unsubscribeCandle(subscription: Candleset, observer: CandleSubscriber): void
	{
		this.candleObservers = this.candleObservers.filter((o) => o[0] !== observer || o[1] !== subscription)
	}

	public subscribeTicker(pair: TradingPair, observer: TickerSubscriber): void
	{
		this.tickerObservers.push([ observer, pair ])
	}

	public unsubscribeTicker(pair: TradingPair, observer: TickerSubscriber): void
	{
		this.tickerObservers = this.tickerObservers.filter((o) => o[0] !== observer || o[1] !== pair)
	}

	public stop(): void
	{
		clearInterval(this.candleInt)
		clearInterval(this.tickerInt)
	}
}

class TestCandleSubscriber implements CandleSubscriber
{
	public receivedCandles: Candle[] = []
	public onCandle(candle: Candle): void
	{
		this.receivedCandles.push(candle)
	}

	public waitForCandles(count: number): Promise<Candle[]>
	{
		return new Promise((resolve) =>
		{
			this.onCandle = (candle: Candle): void =>
			{
				this.receivedCandles.push(candle)
				if (this.receivedCandles.length === count)

					resolve(this.receivedCandles)
			}
		})
	}
}

class TestTickerSubscriber
{
	public receivedTickers: Ticker[] = []
	public onTicker(data: Ticker): void
	{
		this.receivedTickers.push(data)
	}

	public waitForTickers(count: number): Promise<Ticker[]>
	{
		return new Promise((resolve) =>
		{
			this.onTicker = (data: Ticker): void =>
			{
				this.receivedTickers.push(data)
				if (this.receivedTickers.length === count)

					resolve(this.receivedTickers)
			}
		})
	}
}

describe('LiveDataSource', () =>
{
	test('should be of type LiveDataSource', () =>
	{
		const source = new TestLiveDataSource()
		expect(source).toBeInstanceOf(LiveDataSource)
		source.stop()
	})
})

describe('LiveDataSource.subscribeCandle', () =>
{
	test('should send Candles to the subscriber', async() =>
	{
		const source = new TestLiveDataSource()
		const subscriber = new TestCandleSubscriber()
		const set = new Candleset(new CandleInterval(IntervalUnit.MINUTE, 1), { base: 'BTC', trade: 'USDT' })
		source.subscribeCandle(set, subscriber)
		const candles = await subscriber.waitForCandles(3)
		expect(candles.length).toBe(3)
		source.stop()
	})
})

describe('LiveDataSource.subscribeTicker', () =>
{
	test('should send Tickers to the subscriber', async() =>
	{
		const source = new TestLiveDataSource()
		const subscriber = new TestTickerSubscriber()
		const pair = { base: 'BTC', trade: 'USDT' }
		source.subscribeTicker(pair, subscriber)
		const tickers = await subscriber.waitForTickers(3)
		expect(tickers.length).toBe(3)
		source.stop()
	})
})

describe('LiveDataSource.unsubscribeCandle', () =>
{
	test('should stop sending Candles to the subscriber', () =>
	{
		return new Promise<void>((resolve) =>
		{
			const source = new TestLiveDataSource()
			const subscriber = new TestCandleSubscriber()
			const set = new Candleset(new CandleInterval(IntervalUnit.MINUTE, 1), { base: 'BTC', trade: 'USDT' })
			source.subscribeCandle(set, subscriber)

			subscriber.waitForCandles(3).then((candles) =>
			{
				expect(candles.length).toBe(3)

				source.unsubscribeCandle(set, subscriber)

				setTimeout(() =>
				{
					expect(subscriber.receivedCandles.length).toBe(3)
					source.stop()
					resolve()
				}, 60)
			})
		})
	})
})

describe('LiveDataSource.unsubscribeTicker', () =>
{
	test('should stop sending Tickers to the subscriber', () =>
	{
		return new Promise<void>((resolve) =>
		{
			const source = new TestLiveDataSource()
			const subscriber = new TestTickerSubscriber()
			const pair = { base: 'BTC', trade: 'USDT' }
			source.subscribeTicker(pair, subscriber)

			subscriber.waitForTickers(3).then((tickers) =>
			{
				expect(tickers.length).toBe(3)

				source.unsubscribeTicker(pair, subscriber)

				setTimeout(() =>
				{
					expect(subscriber.receivedTickers.length).toBe(3)
					source.stop()
					resolve()
				}, 60)
			})
		})
	})
})
