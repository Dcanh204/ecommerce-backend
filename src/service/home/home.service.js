import Category from "../../models/category.model.js";

class HomeService {
  async getCategory() {
    const categories = await Category.find();
    return categories;
  }
}

export default new HomeService;