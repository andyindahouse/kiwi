import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {PASSPORT_CONFIG, POSTAL_CODES_ALLOWED} from '../config';
import User, {FullUser} from '../models/user';
import {InfoError, Error400, Error401, Error404} from './errorTypes';
import type {RegisterUser, User as UserApiModel} from '@kiwi/models';
import type {RequestHandler} from 'express';

const isRider = (baseUrl: string) => baseUrl === '/api/rider';

export const register: RequestHandler<any, {data: UserApiModel}, RegisterUser> = (
    {body, baseUrl},
    res,
    next
) => {
    User.findOne({email: body.email})
        .then((data) => {
            if (data) {
                throw new InfoError('User already exists');
            }

            const hash = bcrypt.hashSync(body.password, PASSPORT_CONFIG.BCRYPT_ROUNDS);
            const document = new User({
                ...body,
                password: hash,
                active: false,
                rider: isRider(baseUrl),
            });
            return document.save();
        })
        .then((data) => {
            res.json({
                data: {
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    deliveryAddress: data.deliveryAddress,
                    deliveryWeekDay: data.deliveryWeekDay,
                    deliveryHour: data.deliveryHour,
                    deliveryPostalCode: data.deliveryPostalCode,
                    deliveryCity: data.deliveryCity,
                    deliveryVehicle: data.deliveryVehicle,
                    phone: data.phone,
                    rider: data.rider,
                    active: data.active,
                },
            });
        })
        .catch((err) => {
            next(err);
        });
};
export const login: RequestHandler<any, {data: {token: string}}, {email: string}> = async (
    req,
    res,
    next
) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(new Error401('Username or password not correct.'));
    }

    if (isRider(req.baseUrl) !== user.rider) {
        return next(new Error401('Username or password not correct.'));
    }

    passport.authenticate('local', {session: false}, (error, user: FullUser) => {
        if (error || !user) {
            return next(new Error401('Username or password not correct.'));
        }

        if (!user.active) {
            return next(new Error401('User is not active.'));
        }

        const payload = {
            sub: user._id,
            exp: Date.now() + PASSPORT_CONFIG.JWT_LIFETIME,
            email: user.email,
        };
        const token =
            // @ts-ignore TS2769: No overload matches this call (...) 'algorithm' does not exist in type 'SignCallback'
            jwt.sign(JSON.stringify(payload), PASSPORT_CONFIG.JWT_SECRET, {
                algorithm: PASSPORT_CONFIG.JWT_ALGORITHM,
            });
        res.json({data: {token: token}});
    })(req, res);
};
export const isEmailTaken: RequestHandler = async ({query}, res, next) => {
    if (!query.email) {
        return next(new Error400('Query param email not recibed.'));
    }

    res.json({
        data: {
            isTaken: await User.exists({email: String(query.email)}),
        },
    });
};

export const isPostalCodeAllowed: RequestHandler<any, {data: {isAllowed: boolean}}> = async (
    {query},
    res,
    next
) => {
    if (!query.postalCode) {
        return next(new Error400('Query param postalCode not recibed.'));
    }

    res.json({
        data: {
            isAllowed: POSTAL_CODES_ALLOWED.indexOf(parseInt(String(query.postalCode))) > -1,
        },
    });
};

export const getDeliveryCities: RequestHandler<any, {data: {deliveryCities: string[]}}> = async (
    req,
    res,
    next
) => {
    res.json({
        data: {
            deliveryCities: ['Alcalá de Henares'],
        },
    });
};
export const getUserInfo: RequestHandler<any, any, UserApiModel> = async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return next();
    }

    res.json({
        data: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            deliveryAddress: user.deliveryAddress,
            deliveryWeekDay: user.deliveryWeekDay,
            deliveryHour: user.deliveryHour,
            deliveryPostalCode: user.deliveryPostalCode,
            deliveryCity: user.deliveryCity,
            deliveryVehicle: user.deliveryVehicle,
            phone: user.phone,
            rider: user.rider,
            active: user.active,
        },
    });
};

export const editUserInfo: RequestHandler<any, {data: UserApiModel}, UserApiModel> = async (
    {user, body: userInfo},
    res,
    next
) => {
    if (!user) {
        return next();
    }

    const updatedUser = await User.findOneAndUpdate({email: user.email}, userInfo, {
        new: true,
        upsert: false,
        useFindAndModify: false,
    });

    if (!updatedUser) {
        return next(new Error404('User not found.'));
    }

    res.json({
        data: {
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            deliveryAddress: updatedUser.deliveryAddress,
            deliveryWeekDay: updatedUser.deliveryWeekDay,
            deliveryHour: updatedUser.deliveryHour,
            deliveryPostalCode: updatedUser.deliveryPostalCode,
            deliveryCity: updatedUser.deliveryCity,
            deliveryVehicle: updatedUser.deliveryVehicle,
            phone: updatedUser.phone,
            rider: updatedUser.rider,
            active: updatedUser.active,
        },
    });
};

export const editUserPassword: RequestHandler<
    any,
    {data: UserApiModel},
    {newPassword: string; oldPassword: string}
> = async (req, res, next) => {
    if (!req.user) {
        return next(new Error404('User not found.'));
    }

    if (!req.body.newPassword || !req.body.oldPassword) {
        return next(new Error400('Passwords not recived.'));
    }

    if (!bcrypt.compareSync(req.body.oldPassword, req.user.password)) {
        return next(new Error400('Password error.'));
    }

    const updatedUserPassword = await User.findOneAndUpdate(
        {email: req.user.email},
        {
            password: bcrypt.hashSync(req.body.newPassword, PASSPORT_CONFIG.BCRYPT_ROUNDS),
        },
        {
            new: true,
            upsert: false,
            useFindAndModify: false,
        }
    );

    if (!updatedUserPassword) {
        return next(new Error404('User not found.'));
    }

    res.json({
        data: {
            email: updatedUserPassword.email,
            firstName: updatedUserPassword.firstName,
            lastName: updatedUserPassword.lastName,
            deliveryAddress: updatedUserPassword.deliveryAddress,
            deliveryWeekDay: updatedUserPassword.deliveryWeekDay,
            deliveryHour: updatedUserPassword.deliveryHour,
            deliveryPostalCode: updatedUserPassword.deliveryPostalCode,
            deliveryCity: updatedUserPassword.deliveryCity,
            deliveryVehicle: updatedUserPassword.deliveryVehicle,
            phone: updatedUserPassword.phone,
            rider: updatedUserPassword.rider,
            active: updatedUserPassword.active,
        },
    });
};
