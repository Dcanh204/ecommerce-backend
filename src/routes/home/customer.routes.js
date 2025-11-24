import express from 'express';
import * as customerController from '../../controllers/home/customer.controller.js'
const customerRouter = express.Router();

customerRouter.post('/customer-register', customerController.customer_register);
customerRouter.post('/customer-login', customerController.customer_login);

export default customerRouter;