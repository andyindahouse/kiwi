import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {personOutline, informationCircleOutline, listOutline} from 'ionicons/icons';
import AllOrders from './pages/all-orders';
import Orders from './pages/orders';
import Order from './pages/order';
import Delivery from './pages/delivery';
import Help from './pages/help';
import Profile from './pages/profile';
import {ShoppingProvider} from './contexts/shopping-cart';
import {createBrowserHistory} from 'history';

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
import Feedback from './pages/feedback';

/* We have to do a full reload page to avoid side effects with lifecycle custom of ionic.
 * It's a pain use only his custom hooks to manage all logic of app
 */
const history = createBrowserHistory({forceRefresh: true});

const App: React.FC = () => (
    <IonReactRouter history={history}>
        <ShoppingProvider>
            <IonTabs>
                <IonRouterOutlet>
                    <Route path="/orders" component={Orders} exact />
                    <Route path="/orders/:id" component={Order} exact />
                    <Route path="/orders/all" component={AllOrders} exact />
                    <Route path="/orders/delivery/:id" component={Delivery} exact />
                    <Route path="/profile" component={Profile} exact />
                    <Route path="/help" component={Help} exact />
                    <Route path="/feedback" component={Feedback} exact />
                    <Route path="/" render={() => <Redirect to="/home" />} exact />
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
        </ShoppingProvider>
    </IonReactRouter>
);

export default App;
