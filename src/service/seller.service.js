import Seller from "../models/seller.model.js";

class SellerService {
  async getSeller(status, parPage, page, searchValue) {
    let skipPage = 0;
    if (page && parPage) {
      skipPage = parseInt(parPage) * (parseInt(page) - 1);
    }
    const query = {
      status,
      ...(searchValue && searchValue.trim() !== '' ? { $text: { $search: searchValue } } : {})
    }

    const [sellers, totalSellers] = await Promise.all([
      Seller.find(query).skip(skipPage).limit(parseInt(parPage)).sort({ createdAt: -1 }),
      Seller.countDocuments(query)
    ])
    return { sellers, totalSellers }
  }

  async getSellerById(id) {
    const seller = await Seller.findById(id);
    return seller;
  }
}

export default new SellerService;