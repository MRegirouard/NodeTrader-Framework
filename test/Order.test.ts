import Order from '../src/Order'
import { OrderType } from '../src/Order'

describe('new Order', () =>
{
    test('should create a new Order', () =>
    {
        const order = new Order(100, OrderType.BUY)
        expect(order)
        expect(order.amount).toBe(100)
        expect(order.type).toBe(OrderType.BUY)
    })

    test('should invert a negative buy order', () =>
    {
        const order = new Order(-100, OrderType.BUY)
        expect(order)
        expect(order.amount).toBe(100)
        expect(order.type).toBe(OrderType.SELL)
    })

    test('should invert a negative sell order', () =>
    {
        const order = new Order(-100, OrderType.SELL)
        expect(order)
        expect(order.amount).toBe(100)
        expect(order.type).toBe(OrderType.BUY)
    })
})

describe('Order.combine', () =>
{
    test('should combine two buy orders', () =>
    {
        const order1 = new Order(100, OrderType.BUY)
        const order2 = new Order(50, OrderType.BUY)
        const order = Order.combine(order1, order2)
        expect(order)
        expect(order.amount).toBe(150)
        expect(order.type).toBe(OrderType.BUY)
    })

    test('Should combine two sell orders', () =>
    {
        const order1 = new Order(100, OrderType.SELL)
        const order2 = new Order(50, OrderType.SELL)
        const order = Order.combine(order1, order2)
        expect(order)
        expect(order.amount).toBe(150)
        expect(order.type).toBe(OrderType.SELL)
    })

    test('Should combine a buy and sell order', () =>
    {
        const order1 = new Order(100, OrderType.BUY)
        const order2 = new Order(50, OrderType.SELL)
        const order = Order.combine(order1, order2)
        expect(order)
        expect(order.amount).toBe(50)
        expect(order.type).toBe(OrderType.BUY)
    })
})
