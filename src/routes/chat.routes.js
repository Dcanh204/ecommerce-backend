import express from 'express';
import * as chatController from '../controllers/chat/chat.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js';
const chatRouter = express.Router();

chatRouter.post('/customer/add-customer-friend', chatController.add_customer_friend);
chatRouter.post('/customer/send-message-to-seller', chatController.send_message_to_seller);
chatRouter.get('/get-friends/:userId', chatController.get_friends);

chatRouter.get('/seller/get-customers/:sellerId', chatController.get_customers);
chatRouter.get('/seller/get-customer-messages/:customerId', authMiddleware, chatController.get_customer_messages);
chatRouter.post('/seller/send-message', authMiddleware, chatController.send_message);

export default chatRouter;