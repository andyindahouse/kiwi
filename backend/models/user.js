import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    firstName: String,
    lastName: String,
    deliveryAddress: String,
    deliveryWeekDay: String,
    deliveryHour: String,
    deliveryPostalCode: String,
    deliveryCity: String,
    deliveryVehicle: String,
    phone: String,
    rider: Boolean,
    active: Boolean,
});

export default mongoose.model('User', UserSchema, 'users');
