import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        deliveryDays: [],
    },
    {capped: {size: 1}}
);

export default mongoose.model('Config', OrderSchema, 'config');
