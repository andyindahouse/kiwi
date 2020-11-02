import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {homeSharp, cartSharp, nutritionSharp, menuSharp} from 'ionicons/icons';
import Home from './pages/home';
import SearchProducts from './pages/search-products';
import ShoppingCart from './pages/shopping-cart';
import Others from './pages/others';
import Pantry from './pages/pantry';
import Orders from './pages/orders';
import Order from './pages/order';

import {ShoppingProvider} from './contexts/shopping-cart';

const AuthenticatedApp: React.FC = () => {
    return (
        <IonReactRouter>
            <ShoppingProvider>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route path="/home" component={Home} exact />
                        <Route path="/search" component={SearchProducts} exact />
                        <Route path="/search/cart" component={ShoppingCart} exact />
                        <Route path="/nutrition" component={Pantry} exact />
                        <Route path="/others" component={Others} exact />
                        <Route path="/others/orders" component={Orders} exact />
                        <Route path="/others/orders/:id" component={Order} exact />
                        <Route path="/" render={() => <Redirect to="/home" />} exact />
                    </IonRouterOutlet>
                    <IonTabBar slot="bottom">
                        <IonTabButton tab="home" href="/home">
                            <IonIcon icon={homeSharp} />
                        </IonTabButton>
                        <IonTabButton tab="shopping" href="/search">
                            <IonIcon icon={cartSharp} />
                        </IonTabButton>
                        <IonTabButton tab="nutrition" href="/nutrition">
                            <IonIcon icon={nutritionSharp} />
                        </IonTabButton>
                        <IonTabButton tab="others" href="/others">
                            <IonIcon icon={menuSharp} />
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </ShoppingProvider>
        </IonReactRouter>
    );
};

export default AuthenticatedApp;
