import React from 'react';
import AuthenticatedApp from './authenticated-app';
import {useAuth} from './contexts/auth';
import UnauthenticatedApp from './unathenticated-app';

const App: React.FC = () => {
    const {user} = useAuth();

    return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default App;
