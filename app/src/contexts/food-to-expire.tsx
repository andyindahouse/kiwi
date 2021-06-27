import * as React from 'react';
import kiwiApi from '../api';
import {Plugins, Capacitor} from '@capacitor/core';
import {PantryProduct} from '@kiwi/models';
import {useIonViewDidEnter} from '@ionic/react';

const setLocalNotifications = async (pantryProducts: ReadonlyArray<PantryProduct>) => {
    if (Capacitor.isNative && (await Plugins.LocalNotifications.areEnabled())) {
        await Plugins.LocalNotifications.requestPermission();
        Plugins.LocalNotifications.schedule({
            notifications: [
                {
                    id: 1,
                    title: 'Title',
                    body: 'Body',
                    schedule: {at: new Date(Date.now() + 1000 * 20)},
                },
            ],
        });
    } else {
        console.log(`INFO: local notifications can't setted`);
    }
};

type FoodToExpire = {
    products: ReadonlyArray<PantryProduct>;
    isLoading: boolean;
};

const initialState = {
    products: [],
    isLoading: false,
};

const FoodToExpireContext = React.createContext<
    FoodToExpire & {setFoodToExpire: (state: FoodToExpire) => void}
>({
    ...initialState,
    setFoodToExpire: (state: FoodToExpire) => {},
});

export const FoodToExpireProvider = ({children}: {children: React.ReactNode}) => {
    const [foodToExpire, setFoodToExpire] = React.useState<FoodToExpire>(initialState);

    React.useEffect(() => {
        console.log('FoodToExpireProvider');
        setFoodToExpire({
            ...foodToExpire,
            isLoading: true,
        });
        kiwiApi
            .getPantry({
                pageNumber: 0,
                pageSize: 5,
                perishable: true,
            })
            .then((res) => {
                setFoodToExpire({
                    products: res.content,
                    isLoading: false,
                });
            });
    }, []);

    return (
        <FoodToExpireContext.Provider value={{...foodToExpire, setFoodToExpire}}>
            {children}
        </FoodToExpireContext.Provider>
    );
};

export const useFoodToExpire = () => {
    const context = React.useContext(FoodToExpireContext);
    if (context === undefined) {
        throw new Error('useFoodToExpire must be used within a FoodToExpireProvider');
    }
    return context;
};
