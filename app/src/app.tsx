import React from 'react';
import AuthenticatedApp from './authenticated-app';
import {useAuth} from './contexts/auth';
import Login from './pages/login';

const App: React.FC = () => {
    return <AuthenticatedApp />;
};

export default App;
