import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";

export default class OrderRepository implements OrderRepositoryInterface{
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
        orderModel = await OrderModel.findOne({
            where: { id },
            include: ["items"],
            rejectOnEmpty: true
        });
    } catch (error) {
        throw new Error("Order not found");
    }

    return new Order(orderModel.id,
        orderModel.customer_id,
        orderModel.items.map(orderItemModel => new OrderItem(
            orderItemModel.id,
            orderItemModel.name,
            orderItemModel.price,
            orderItemModel.product_id,
            orderItemModel.quantity)));
  }

  async findAll(): Promise<Order[]> {
    return Promise.resolve([]);
  }

  async update(entity: Order): Promise<void> {
    return Promise.resolve(undefined);
  }
}
