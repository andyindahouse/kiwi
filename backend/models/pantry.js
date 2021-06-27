import mongoose from 'mongoose';

const PantrySchema = new mongoose.Schema({
    email: String,
    inStorage: String,
    id: String,
    ean: String,
    img: String,
    name: String,
    buyedDate: Date,
    date: Date,
});

export default mongoose.model('Pantry', PantrySchema, 'pantries');
