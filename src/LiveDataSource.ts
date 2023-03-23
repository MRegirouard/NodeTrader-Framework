import type Candle from './Candle'
import type TradingPair from './TradingPair'
import type Candleset from './Candleset'
import type { Ticker } from 'ccxt'

/**
 * An object that can subscribe to candles. Must implement onCandle.
 */
interface CandleSubscriber
{
	onCandle(candle: Candle): void
}

/**
 * An object that can subscribe to tickers. Must implement onTicker.
 */
interface TickerSubscriber
{
	onTicker(data: Ticker): void
}

/**
 * A data source that provides live data, such as candles and tickers. Other class can
 * subscribe and unsubscribe to this data source.
 */
abstract class LiveDataSource
{
	public abstract subscribeCandle(subscription: Candleset, observer: CandleSubscriber): void
	public abstract unsubscribeCandle(subscription: Candleset, observer: CandleSubscriber): void
	public abstract subscribeTicker(pair: TradingPair, observer: TickerSubscriber): void
	public abstract unsubscribeTicker(pair: TradingPair, observer: TickerSubscriber): void
}

export default LiveDataSource
export type { CandleSubscriber, TickerSubscriber }
export { LiveDataSource }
