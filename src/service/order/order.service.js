import moment from "moment";
import CustomerOrder from './../../models/customerOrder.model.js';
import AuthorOrder from './../../models/authorOrder.model.js';
import Cart from './../../models/cart.model.js';

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
  async place_order(products, price, shipping_fee, items, shoppingInfo, userId) {
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
      shoppingInfo,
      products: customerOrderProduct,
      price: price + shipping_fee,
      payment_status: 'unpaid',
      delivery_status: 'pending',
      date: tempDate
    })
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
        price: pri,
        payment_status: 'unpaid',
        shippingInfo: 'Easy shop',
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
}

export default new OrderService;