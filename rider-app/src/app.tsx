import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {personOutline, informationCircleOutline, listOutline} from 'ionicons/icons';
import AllOrders from './pages/all-orders';
import Orders from './pages/orders';
import Order from './pages/order';
import Delivery from './pages/delivery';
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
                            <Route path="/orders" component={Orders} exact={true} />
                            <Route path="/orders/:id" component={Order} exact={true} />
                            <Route path="/orders/all" component={AllOrders} exact={true} />
                            <Route path="/orders/delivery/:id" component={Delivery} exact={true} />
                            <Route path="/profile" component={Orders} exact={true} />
                            <Route path="/help" component={Orders} exact={true} />
                            <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
                        </IonRouterOutlet>
                        <IonTabBar slot="bottom">
                            <IonTabButton tab="orders" href="/orders">
                                <IonIcon icon={listOutline} />
                            </IonTabButton>
                            <IonTabButton tab="profile" href="/profile">
                                <IonIcon icon={personOutline} />
                            </IonTabButton>
                            <IonTabButton tab="help" href="/help">
                                <IonIcon icon={informationCircleOutline} />
                            </IonTabButton>
                        </IonTabBar>
                    </IonTabs>
                </IonReactRouter>
            </ShoppingProvider>
        </ThemeProvider>
    </IonApp>
);

export default App;
