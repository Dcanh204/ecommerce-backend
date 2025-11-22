import express from 'express';
import * as homeController from '../../controllers/home/home.controller.js'
const homeRouter = express.Router();

homeRouter.get('/categories', homeController.getCategory)

export default homeRouter;