import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    firstName: String,
    lastName: String,
    phone: String,
    rider: String,
    createdDate: Date,
    status: String,
    note: String,
    products: [],
    deliverFee: Number,
    shopperFee: Number,
    deliveryDiscount: Number,
    finalDeliverFee: Number,
    finalShopperFee: Number,
    totalShoppingCart: Number,
    totalCost: Number,
    deliveryAddress: String,
    deliveryPostalCode: String,
    deliveryDate: Date,
    deliveryHour: String,
    replaceProducts: Boolean,
});

export default mongoose.model('Order', OrderSchema, 'orders');
