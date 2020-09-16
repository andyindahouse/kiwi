import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {homeSharp, cartSharp, nutritionSharp, menuSharp} from 'ionicons/icons';
import Home from './pages/home';
import SearchProducts from './pages/search-products';
import ShoppingCart from './pages/shopping-cart';
import Nutrition from './pages/nutrition';
import Others from './pages/others';
import Pantry from './pages/pantry';
import Orders from './pages/orders';
import Order from './pages/order';
import {ThemeProvider} from 'react-jss';
import palette from './theme/palette';
import {ShoppingProvider} from './contexts/shopping-cart';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const App: React.FC = () => (
    <IonApp>
        <ThemeProvider theme={{palette}}>
            <ShoppingProvider>
                <IonReactRouter>
                    <IonTabs>
                        <IonRouterOutlet>
                            <Route path="/home" component={Home} exact />
                            <Route path="/search" component={SearchProducts} exact />
                            <Route path="/search/cart" component={ShoppingCart} exact />
                            <Route path="/nutrition" component={Nutrition} exact />
                            <Route path="/others" component={Others} exact />
                            <Route path="/others/pantry" component={Pantry} exact />
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
                </IonReactRouter>
            </ShoppingProvider>
        </ThemeProvider>
    </IonApp>
);

export default App;
