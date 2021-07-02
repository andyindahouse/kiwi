import mongoose from 'mongoose';
import {User, RegisterUser} from '@kiwi/models';

export type FullUser = RegisterUser &
    User & {
        _id: string;
    };

const UserSchema = new mongoose.Schema<FullUser>({
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

export default mongoose.model<FullUser>('User', UserSchema, 'users');
