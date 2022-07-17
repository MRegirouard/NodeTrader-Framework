/**
 * Represents the type of an order.
 */
enum OrderType
{
	BUY, // Represents an order where the "base" currency is exchanged for the "trade" currency.
	SELL // Represents an order where the "trade" currency is exchanged for the "base" currency.
}

/**
 * Represents an order to be made.
 */
class Order
{
	public readonly amount: number // The amount to buy / sell.
	public readonly type: OrderType // Whether this is a buy or sell order.

	/**
	 * Creates a new order with the given amount and type.
	 * @param amount The amount to buy / sell. If a negative number is given, the opposite of OrderType will be used.
	 * @param type The type of order to make, "buy" for buying the "trade" currency,
	 * and "sell" for buying the "base" currency.
	 */
	constructor(amount: number, type: OrderType)
	{
		this.amount = Math.abs(amount)
		
		if (amount < 0)
			this.type = type == OrderType.BUY ? OrderType.SELL : OrderType.BUY
		else
			this.type = type
	}

	/**
	 * Combines two orders into one. The resulting order will be the net sum of the two orders. For example, if a buy
	 * order of 100 is combined with a sell order of 50, the resulting order will be a buy order of 50.
	 * @param order1 The first order to combine.
	 * @param order2 The second order to combine.
	 * @returns A new order, representing the net sum of the two orders.
	 */
	static combine(order1: Order, order2: Order) : Order
	{
		if (order1.type === order2.type)
			return new Order(order1.amount + order2.amount, order1.type)
		else
			return new Order(order1.amount - order2.amount, order1.type)
	}
}

export default Order
export { OrderType }
