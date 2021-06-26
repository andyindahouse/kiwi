import {Product, ShoppingCart} from '../../models';

const deliverFee = 3;
const shopperFee = 4;
const discount = 0.5;
const products: readonly Product[] = [];
const finalDeliverFee = deliverFee * (1 - discount);
const finalShopperFee = shopperFee * (1 - discount);
const totalShoppingCart = 50;
const totalCost = totalShoppingCart + finalDeliverFee + finalShopperFee;

export const shoppingCart: ShoppingCart = {
    products,
    deliverFee,
    shopperFee,
    finalDeliverFee,
    finalShopperFee,
    totalShoppingCart,
    totalCost,
    deliveryDiscount: discount,
};
