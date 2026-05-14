import express from 'express';
import * as chatbotController from '../../controllers/chatbot/chatbot.controller.js';

const chatbotRouter = express.Router();

chatbotRouter.post('/', chatbotController.chatWithAI);

export default chatbotRouter;