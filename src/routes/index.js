import express from 'express';
import authRouter from './auth.routes.js';
import categoryRouter from './dashboard/category.routes.js';
import productRouter from './dashboard/product.routes.js';
import sellerRouter from './dashboard/seller.routes.js';
import homeRouter from './home/home.routes.js';
import customerRouter from './home/customer.routes.js';

const rootRouter = express.Router();
//auth router
rootRouter.use("/auth", authRouter);
rootRouter.use("/categories", categoryRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/sellers", sellerRouter);
rootRouter.use("/home", homeRouter);
rootRouter.use("/customer", customerRouter);




export default rootRouter;