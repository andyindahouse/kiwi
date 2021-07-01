import express from 'express';
const router = express.Router();
import customMdw from '../middleware/custom';
import UserController from '../controllers/user';
import OrdersRiderController from '../controllers/orders-rider';
import ConfigController from '../controllers/config';

router.get('/config', ConfigController.config);

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get('/me', customMdw.ensureAuthenticated, UserController.getUserInfo);
router.patch('/me', customMdw.ensureAuthenticated, UserController.editUserInfo);
router.post('/me/password', customMdw.ensureAuthenticated, UserController.editUserPassword);
router.get('/deliveryCities', UserController.getDeliveryCities);

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
    '/orders/:orderId/products/:id',
    customMdw.ensureAuthenticated,
    customMdw.ensureRider,
    OrdersRiderController.updateProduct
);
router.delete(
    '/orders/:orderId/products/:id',
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

export default router;
