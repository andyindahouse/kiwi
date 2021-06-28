import mongoose from 'mongoose';

const ShoppingCartSchema = new mongoose.Schema({
    email: String,
    products: [
        {
            id: String,
            units: Number,
            note: String,
        },
    ],
});

export default mongoose.model('ShoppingCart', ShoppingCartSchema, 'shoppingCarts');
