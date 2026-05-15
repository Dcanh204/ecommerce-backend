import moment from "moment";
import CustomerOrder from './../../models/customerOrder.model.js';
import AuthorOrder from './../../models/authorOrder.model.js';
import Cart from './../../models/cart.model.js';
import mongoose from "mongoose";

class OrderService {

  async paymentCheck(id) {
    const order = await CustomerOrder.findById(id);
    if (order.payment_status === 'unpaid') {
      await CustomerOrder.findByIdAndUpdate(id, {
        delivery_status: 'cancelled'
      })
      await AuthorOrder.updateMany({
        orderId: id
      }, {
        delivery_status: 'cancelled'
      })
    }
    return true;
  }
  async place_order(products, price, shipping_fee, items, shippingInfo, userId) {
    let authorOrderData = [];
    let cartId = [];
    let tempDate = moment(Date.now()).format('LLL');
    let customerOrderProduct = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i].products;
      for (let j = 0; j < product.length; j++) {
        const tempCusPro = product[j].productInfo;
        tempCusPro.quantity = product[j].quantity;
        customerOrderProduct.push(tempCusPro);
        if (product[j]._id) {
          cartId.push(product[j]._id)
        }
      }
    }
    const order = await CustomerOrder.create({
      customerId: userId,
      shippingInfo,
      products: customerOrderProduct,
      price: price + shipping_fee,
      payment_status: 'unpaid',
      delivery_status: 'pending',
      date: tempDate
    })
    const shippingPerSeller = shipping_fee / products.length;
    for (let i = 0; i < products.length; i++) {
      const pro = products[i].products;
      const pri = products[i].price;
      const sellerId = products[i].sellerId;
      let storeProduct = []
      for (let j = 0; j < pro.length; j++) {
        const tempPro = pro[j].productInfo;
        tempPro.quantity = pro[j].quantity;
        storeProduct.push(tempPro);
      }
      authorOrderData.push({
        orderId: order._id,
        sellerId,
        products: storeProduct,
        price: pri + shippingPerSeller,
        payment_status: 'unpaid',
        shippingInfo: shippingInfo,
        delivery_status: 'pending',
        date: tempDate
      })
    }
    await AuthorOrder.insertMany(authorOrderData);
    await Cart.deleteMany({ _id: { $in: cartId } });
    setTimeout(() => {
      this.paymentCheck(order.id)
    }, 15000)
    return order.id;
  }

  // get order
  async get_order_dashboard(userId) {
    const [recentOrders, totalOrder, totalPendingOrder, totalCancelledOrder] = await Promise.all([
      CustomerOrder.find({ customerId: userId }).sort({ createdAt: -1 }).limit(5),
      CustomerOrder.find({ customerId: userId }).countDocuments(),
      CustomerOrder.find({ customerId: userId, delivery_status: 'pending' }).countDocuments(),
      CustomerOrder.find({ customerId: userId, delivery_status: 'cancelled' }).countDocuments(),
    ])

    return {
      recentOrders,
      totalOrder,
      totalPendingOrder,
      totalCancelledOrder
    }
  }

  async get_orders(userId, status) {
    const query = {
      customerId: userId
    }
    if (status && status !== 'all') {
      query.delivery_status = status
    }
    const orders = await CustomerOrder.find(query).sort({ createdAt: -1 });
    return orders;
  }

  async get_order_by_id(orderId) {
    const order = await CustomerOrder.findById(orderId);
    return order
  }

  async get_admin_orders(searchValue, page, parPage) {
    const skipPage = parPage * (page - 1);

    // const query = searchValue && searchValue !== '' ? { $text: { $search: searchValue } } : {};

    const [orders, totalOrders] = await Promise.all([
      CustomerOrder.aggregate([
        {
          $lookup: {
            from: 'authororders',
            localField: '_id',
            foreignField: 'orderId',
            as: 'suborder'
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skipPage },
        { $limit: parPage }
      ]),
      CustomerOrder.aggregate([
        {
          $lookup: {
            from: 'authororders',
            localField: '_id',
            foreignField: 'orderId',
            as: 'suborder'
          }
        },
        { $count: 'total' }
      ])
    ])

    return { orders, totalOrders: totalOrders[0]?.total || 0 }
  }

  async get_admin_order(orderId) {
    const order = await CustomerOrder.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId.createFromHexString(orderId) }
      },
      {
        $lookup: {
          from: 'authororders',
          localField: 'orderId',
          foreignField: '_id',
          as: 'suborder'
        }
      }
    ])

    return {
      order: order[0]
    }
  }

  async admin_order_status_update(orderId, status) {
    await CustomerOrder.findByIdAndUpdate(orderId, {
      delivery_status: status
    })
    await AuthorOrder.updateMany(
      { orderId: orderId },
      { delivery_status: status }
    );
  }

  async get_seller_orders(searchValue, page, parPage, sellerId) {
    const skipPage = parPage * (page - 1);

    const [orders, totalOrders] = await Promise.all([
      AuthorOrder.find({ sellerId }).skip(skipPage).limit(parPage).sort({ createdAt: -1 }),
      AuthorOrder.countDocuments({ sellerId })
    ])

    return {
      orders,
      totalOrders
    }
  }

  async get_seller_order(orderId) {
    const order = await AuthorOrder.findById(orderId);
    return order;
  }

  async seller_order_status_update(orderId, status) {
    const authorOrder = await AuthorOrder.findByIdAndUpdate(
      orderId,
      {
        delivery_status: status
      },
      { new: true }
    );

    if (!authorOrder) {
      throw new Error('Order not found');
    }
    await CustomerOrder.findByIdAndUpdate(
      authorOrder.orderId,
      {
        delivery_status: status
      }
    );

    return authorOrder;
  }
}

export default new OrderService;