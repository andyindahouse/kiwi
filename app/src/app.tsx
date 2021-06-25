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
import {useAuth} from './contexts/auth';
import Login from './pages/login';
import UnauthenticatedPantry from './pages/unauthenticated-pantry';

const AuthenticatedApp: React.FC = () => {
    const {user} = useAuth();

    return (
        <IonReactRouter>
            <ShoppingProvider>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route path="/:tab(home)" component={Home} exact />
                        <Route path="/:tab(search)" component={SearchProducts} exact />
                        <Route path="/:tab(search)/cart" component={ShoppingCart} exact />
                        <Route
                            path="/:tab(nutrition)"
                            render={(props) => (user ? <Pantry {...props} /> : <UnauthenticatedPantry />)}
                            exact
                        />
                        <Route path="/others" component={user ? Others : Login} exact />
                        <Route
                            path="/:tab(others)/orders"
                            render={() => (user ? <Orders /> : <Redirect to="/others" />)}
                            exact
                        />
                        <Route
                            path="/:tab(others)/orders/:id"
                            render={(props) => (user ? <Order {...props} /> : <Redirect to="/others" />)}
                            exact
                        />

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
