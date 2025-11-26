import express from 'express';
import * as cartController from '../../controllers/home/cart.controller.js'
const cartRouter = express.Router();

cartRouter.post('/', cartController.add_to_cart);
cartRouter.get('/:userId', cartController.get_cart_product);
cartRouter.delete('/:cartId', cartController.delete_cart_product);
cartRouter.put('/quantity-inc/:cartId', cartController.quantity_inc);
cartRouter.put('/quantity-dec/:cartId', cartController.quantity_dec);

export default cartRouter;