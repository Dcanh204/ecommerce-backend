import { geminiModel } from "../../config/gemini.js";
import Product from "../../models/product.model.js";

class ChatbotService {
  // Phương thức trợ giúp để gọi Gemini API
  async _getGeminiResponse(context, message) {
    const chatSession = geminiModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: context }],
        },
        {
          role: "model",
          parts: [{ text: "Tôi đã hiểu nhiệm vụ. Tôi sẽ dùng dữ liệu bạn cung cấp để hỗ trợ khách hàng." }],
        },
      ],
    });
    const result = await chatSession.sendMessage(message);
    return result.response.text();
  }

  // Phương thức trích xuất từ khóa sản phẩm từ câu nói của người dùng
  async _extractKeywords(message) {
    const prompt = `Bạn là chuyên gia trích xuất thực thể. Từ câu nói của khách hàng: "${message}", hãy chỉ trích xuất tên sản phẩm hoặc model sản phẩm (ví dụ: "iphone 17", "giày nike"). Nếu không có sản phẩm cụ thể, trả về "none". Chỉ trả về chuỗi từ khóa, không giải thích gì thêm.`;
    const result = await geminiModel.generateContent(prompt);
    return result.response.text().trim();
  }

  async chat(message) {

    const greetingPatterns = /^(xin chào|chào|hi|hello|hey|alo|chào shop|good morning|good afternoon)$/i;
    const isGreeting = greetingPatterns.test(message.trim().toLowerCase());

    let context = "Bạn là trợ lý bán hàng thông minh của một cửa hàng thương mại điện tử Easy Shop.";

    if (!isGreeting) {

      const searchQuery = await this._extractKeywords(message);

      let products = [];
      if (searchQuery.toLowerCase() !== "none") {

        products = await Product.find({ // Using the extracted search query for more precise search
          $text: { $search: searchQuery }
        }).limit(5);
      }

      if (products.length > 0) {
        // Modified context: Instruct Gemini to be concise and confirm product availability.
        context += ` Chúng tôi đã tìm thấy ${products.length} sản phẩm liên quan đến yêu cầu của khách hàng. Hãy trả lời ngắn gọn xác nhận rằng sản phẩm có sẵn và mời khách hàng xem thông tin chi tiết dưới dạng card sản phẩm hoặc nhấn xem thêm. Không cần liệt kê chi tiết sản phẩm trong câu trả lời của AI.`;

        const aiResponse = await this._getGeminiResponse(context, message);
        return { aiResponse, products };
      } else {
        context += ` Hiện tại không tìm thấy sản phẩm cụ thể nào khớp với yêu cầu trong kho. Hãy trả lời lịch sự và đề nghị họ cung cấp thêm chi tiết hoặc tìm kiếm sản phẩm khác.`;
        const aiResponse = await this._getGeminiResponse(context, message);
        return { aiResponse, products: [] };
      }
    } else {
      return {
        aiResponse: "Chào bạn! Tôi là trợ lý ảo của Easy Shop. Hãy cho tôi biết bạn cần tìm sản phẩm gì nhé.", // Shortened greeting
        products: []
      };
    }
  }
}

export default new ChatbotService();