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

        products = await Product.find({
          $text: { $search: searchQuery }
        }).limit(5);
      }

      if (products.length > 0) {
        context += ` Dưới đây là thông tin các sản phẩm tìm thấy trong kho dựa trên câu hỏi của khách hàng:\n`;
        products.forEach((product, index) => {
          context += `${index + 1}. Tên: ${product.name}, Thương hiệu: ${product.brand}, Giá: ${product.price.toLocaleString()} VNĐ, Giảm giá: ${product.discount}%, Tồn kho: ${product.stock}, Mô tả: ${product.description}\n`;
        });
        context += "\nHãy dựa vào thông tin sản phẩm trên để tư vấn cho khách hàng một cách chi tiết, thân thiện và chuyên nghiệp. Nếu khách hàng hỏi về giá, hãy tính toán giá sau khi giảm nếu có. Đồng thời, hãy gợi ý rằng khách hàng có thể xem chi tiết sản phẩm và các sản phẩm tương tự bằng cách nhấn vào nút 'Xem thêm' hoặc các thẻ sản phẩm hiển thị.";

        const aiResponse = await this._getGeminiResponse(context, message);
        return { aiResponse, products };
      } else {
        context += ` Hiện tại không tìm thấy sản phẩm cụ thể nào khớp với yêu cầu trong kho. Hãy trả lời lịch sự và đề nghị họ cung cấp thêm chi tiết hoặc tìm kiếm sản phẩm khác.`;
        const aiResponse = await this._getGeminiResponse(context, message);
        return { aiResponse, products: [] };
      }
    } else {
      // Nếu là chào hỏi, cung cấp context phản hồi thân thiện
      context = "Bạn là trợ lý bán hàng thông minh của một cửa hàng thương mại điện tử Easy Shop. Khách hàng vừa gửi lời chào. Hãy phản hồi lại một cách ngắn gọn, niềm nở, thân thiện và giới thiệu rằng bạn có thể hỗ trợ họ tìm kiếm thông tin sản phẩm hoặc tư vấn mua sắm.";
      const aiResponse = await this._getGeminiResponse(context, message);
      return { aiResponse, products: [] };
    }
  }
}

export default new ChatbotService();