import * as React from 'react';
import kiwiApi from '../api';
import {TOKEN_KEY_LOCAL_STORAGE} from '../constants';
import {User} from '../models';

type Auth = {
    user: null | User;
    setUser: (user: User) => void;
    logout: () => void;
};

const AuthContext = React.createContext<Auth>({
    user: null,
    setUser: (user: User) => {},
    logout: () => {},
});

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setLoading] = React.useState(true);
    const [isError, setError] = React.useState(false);
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY_LOCAL_STORAGE);
        setUser(null);
    };

    React.useEffect(() => {
        const token = localStorage.getItem('token-auth');
        if (token) {
            kiwiApi
                .getUser()
                .then((user: User) => {
                    setUser(user);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('error with token', error);
                    setError(true);
                });
        } else {
            setLoading(false);
        }
    }, []);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (isError) {
        return <div>Problems...</div>;
    }

    return (
        <AuthContext.Provider
            value={{
                logout,
                setUser,
                user,
            }}
        >
             {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useFoodToExpire must be used within a FoodToExpireProvider');
    }

    return context;
};
