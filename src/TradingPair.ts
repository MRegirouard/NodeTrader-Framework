/**
 * Represents a trading pair, for buying and selling assets. Should contain the symbol of each asset, not the name.
 */
interface TradingPair
{
	base: string // The base asset symbol of the trading pair. For example, 'USDT' for Tether.
	trade: string // The trade asset symbol of the trading pair. For example, 'BTC' for Bitcoin.
}

export default TradingPair
