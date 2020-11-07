'use strict';

const express = require('express');
const router = express.Router();
const customMdw = require('../middleware/custom');
const UserController = require('../controllers/user');
const ProductsController = require('../controllers/products');
const ShoppingCartController = require('../controllers/shoppingCart');
const PantryController = require('../controllers/pantry');
const OrdersController = require('../controllers/orders');

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get('/me', customMdw.ensureAuthenticated, UserController.getUserInfo);
router.patch('/me', customMdw.ensureAuthenticated, UserController.editUserInfo);
router.post('/me/password', customMdw.ensureAuthenticated, UserController.editUserPassword);
router.get('/emailTaken', UserController.isEmailTaken);
router.get('/postalCodeAllowed', UserController.isPostalCodeAllowed);

router.get('/products', ProductsController.products);
router.get('/products/nutriments', ProductsController.getNutrimentsFromProducts);
router.get('/products/:id', ProductsController.productById);

router.get('/shoppingCart', customMdw.ensureAuthenticated, ShoppingCartController.get);
router.post('/shoppingCart', customMdw.ensureAuthenticated, ShoppingCartController.update);

router.get('/pantry', customMdw.ensureAuthenticated, PantryController.get);
router.post('/pantry/:id', customMdw.ensureAuthenticated, PantryController.update);

router.put('/checkout', customMdw.ensureAuthenticated, OrdersController.create);
router.get('/orders', customMdw.ensureAuthenticated, OrdersController.get);
router.get('/orders/:id', customMdw.ensureAuthenticated, OrdersController.getById);
router.post('/orders/:id/status', customMdw.ensureAuthenticated, OrdersController.updateStatus);
router.put('/orders/:id/products', customMdw.ensureAuthenticated, OrdersController.addProduct);
router.post('/orders/:orderId/products/:id', customMdw.ensureAuthenticated, OrdersController.updateProduct);
router.delete('/orders/:orderId/products/:id', customMdw.ensureAuthenticated, OrdersController.deleteProduct);

module.exports = router;
