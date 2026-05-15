import express from 'express';
import authRouter from './auth.routes.js';
import categoryRouter from './dashboard/category.routes.js';
import productRouter from './dashboard/product.routes.js';
import sellerRouter from './dashboard/seller.routes.js';
import homeRouter from './home/home.routes.js';
import customerRouter from './home/customer.routes.js';
import cartRouter from './home/cart.routes.js';
import orderRouter from './order/order.routes.js';
import chatRouter from './chat.routes.js';
import chatbotRouter from './chatbot/chatbot.routes.js';
import paymentRouter from './payment.routes.js';
const rootRouter = express.Router();
//auth router
rootRouter.use("/auth", authRouter);
rootRouter.use("/categories", categoryRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/sellers", sellerRouter);
rootRouter.use("/home", homeRouter);
rootRouter.use("/customer", customerRouter);
rootRouter.use("/cart", cartRouter);
rootRouter.use("/order", orderRouter);
rootRouter.use("/chat", chatRouter);
rootRouter.use("/chatbot", chatbotRouter);
rootRouter.use("/payment", paymentRouter);


export default rootRouter;