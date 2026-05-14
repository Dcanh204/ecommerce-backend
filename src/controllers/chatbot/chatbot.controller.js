import { StatusCodes } from "http-status-codes";
import chatbotService from "../../service/chatbot/chatbot.service.js";
import catchAsync from "../../utils/catchAsync.js";

export const chatWithAI = catchAsync(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Vui lòng nhập nội dung tin nhắn" });
  }

  const response = await chatbotService.chat(message);

  res.status(StatusCodes.OK).json({ response });
});