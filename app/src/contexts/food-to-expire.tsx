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

type State = {
    products: ReadonlyArray<PantryProduct>;
    isLoading: boolean;
};

const FoodToExpireContext = React.createContext<State | null>(null);

export const FoodToExpireProvider = ({children}: {children: React.ReactNode}) => {
    const [products, setProducts] = React.useState([] as readonly PantryProduct[]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        let cancel = false;
        setIsLoading(true);
        kiwiApi
            .getPantry({
                pageNumber: 0,
                pageSize: 5,
                perishable: true,
            })
            .then(({content}) => {
                if (!cancel) {
                    setProducts(content);
                }
            })
            .finally(() => {
                if (!cancel) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancel = true;
        };
    }, []);

    const context = React.useMemo(() => ({isLoading, products}), [isLoading, products]);
    return <FoodToExpireContext.Provider value={context}>{children}</FoodToExpireContext.Provider>;
};

export const useFoodToExpire = (): State => {
    const context = React.useContext(FoodToExpireContext);
    if (!context) {
        throw new Error('useFoodToExpire must be used within a FoodToExpireProvider');
    }

    return context;
};
