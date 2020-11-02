import {IonRouterOutlet} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router';
import Login from './pages/login';
import Register from './pages/register';

const UnauthenticatedApp: React.FC = () => {
    return (
        <IonReactRouter>
            <Switch>
                <Route path="/login" component={Login} exact />
                <Route path="/register" component={Register} exact />
                <Route>
                    <Redirect to="/login" />
                </Route>
            </Switch>
        </IonReactRouter>
    );
};

export default UnauthenticatedApp;
