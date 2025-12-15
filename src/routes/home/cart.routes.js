import express from 'express';
import * as cartController from '../../controllers/home/cart.controller.js'
const cartRouter = express.Router();

cartRouter.post('/', cartController.add_to_cart);
cartRouter.get('/:userId', cartController.get_cart_product);
cartRouter.delete('/:cartId', cartController.delete_cart_product);
cartRouter.put('/quantity-inc/:cartId', cartController.quantity_inc);
cartRouter.put('/quantity-dec/:cartId', cartController.quantity_dec);
cartRouter.post('/add-to-wishlist', cartController.add_wishlist);
cartRouter.get('/get-wishlist-products/:userId', cartController.get_wishlist);
cartRouter.delete('/remove-wishlist-products/:wishlistId', cartController.remove_wishlist);


export default cartRouter;