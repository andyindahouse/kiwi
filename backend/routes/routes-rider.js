'use strict';

const express = require('express');
const router = express.Router();
const customMdw = require('../middleware/custom');
const UserController = require('../controllers/user');
const OrdersRiderController = require('../controllers/orders-rider');

router.post('/login', UserController.login);

router.get('/orders', customMdw.ensureAuthenticated, customMdw.ensureRider, OrdersRiderController.get);
router.get(
    '/orders/all',
    customMdw.ensureAuthenticated,
    customMdw.ensureRider,
    OrdersRiderController.getAllAvailables
);
router.put('/orders/:id', customMdw.ensureAuthenticated, customMdw.ensureRider, OrdersRiderController.assign);
router.get(
    '/orders/:id',
    customMdw.ensureAuthenticated,
    customMdw.ensureRider,
    OrdersRiderController.getById
);
router.post(
    '/orders/:id/status',
    customMdw.ensureAuthenticated,
    customMdw.ensureRider,
    OrdersRiderController.updateStatus
);
router.put(
    '/orders/:id/products',
    customMdw.ensureAuthenticated,
    customMdw.ensureRider,
    OrdersRiderController.addProduct
);
router.post(
    '/orders/:id/products/:ean',
    customMdw.ensureAuthenticated,
    customMdw.ensureRider,
    OrdersRiderController.updateProduct
);
router.delete(
    '/orders/:id/products/:ean',
    customMdw.ensureAuthenticated,
    customMdw.ensureRider,
    OrdersRiderController.deleteProduct
);
router.post(
    '/orders/:id/finalize',
    customMdw.ensureAuthenticated,
    customMdw.ensureRider,
    OrdersRiderController.finalizeOrder
);

module.exports = router;
