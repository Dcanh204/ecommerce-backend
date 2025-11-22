import Category from "../../models/category.model.js";
import Product from './../../models/product.model.js';

class HomeService {
  async getCategory() {
    const categories = await Category.find();
    return categories;
  }
  formatProducts(products) {
    const productArray = [];
    let i = 0;
    while (i < products.length) {
      let temp = [];
      let j = i;
      while (j < i + 3) {
        if (products[j]) {
          temp.push(products[j])
        }
        j++;
      }
      productArray.push([...temp]);
      i = j;
    }
    return productArray
  }
  async getProduct() {
    const products = await Product.find().limit(18).sort({ createdAt: -1 })
    const latest = await Product.find().limit(9).sort({ createdAt: -1 });
    const topRate = await Product.find({ rating: { $gt: 0 } }).limit(9).sort({ rating: -1 });
    const discount = await Product.find({ discount: { $gt: 0 } }).limit(9).sort({ discount: -1 });

    return {
      products,
      latest_product: this.formatProducts(latest),
      topRate_product: this.formatProducts(topRate),
      discount_product: this.formatProducts(discount),
    }
  }
}

export default new HomeService;