'use strict';

const express = require('express');
const router = express.Router();
const customMdw = require('../middleware/custom');
const UserController = require('../controllers/user');
const ProductsController = require('../controllers/products');
const ShoppingCartController = require('../controllers/shoppingCart');
const PantryController = require('../controllers/pantry');
const CheckoutController = require('../controllers/checkout');
const SampleController = require('../controllers/sample');

router.post('/login', UserController.login);
router.post('/register', UserController.register);

router.get('/products', ProductsController.products);
router.get('/products/:ean', ProductsController.productByEan);

router.get('/shoppingCart', customMdw.ensureAuthenticated, ShoppingCartController.get);
router.post('/shoppingCart', customMdw.ensureAuthenticated, ShoppingCartController.update);

router.get('/pantry', customMdw.ensureAuthenticated, PantryController.get);
router.post('/pantry', customMdw.ensureAuthenticated, PantryController.update);

router.get('/checkout', customMdw.ensureAuthenticated, CheckoutController.get);
router.get('/checkout/all', customMdw.ensureAuthenticated, CheckoutController.getAll);
router.put('/checkout', customMdw.ensureAuthenticated, CheckoutController.create);

router.get('/test', SampleController.unprotected);
router.get('/protected', customMdw.ensureAuthenticated, SampleController.protected);

module.exports = router;
