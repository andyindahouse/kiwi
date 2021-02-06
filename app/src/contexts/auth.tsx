import * as React from 'react';
import kiwiApi from '../api';
import {TOKEN_KEY_LOCAL_STORAGE} from '../constants';
import {User} from '../models';
import {IonSpinner} from '@ionic/react';

type Auth = {
    user: null | User;
    setUser: (user: User) => void;
    logout: () => void;
    login: (data: {email: string; password: string}) => Promise<null | User>;
};

const AuthContext = React.createContext<Auth>({
    user: null,
    setUser: (user: User) => {},
    logout: () => {},
    login: (data: {email: string; password: string}) => Promise.resolve(null),
});

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setLoading] = React.useState(true);
    const login = ({email, password}: {email: string; password: string}) => {
        return kiwiApi.login({email, password}).then(({token}) => {
            localStorage.setItem(TOKEN_KEY_LOCAL_STORAGE, token);
            return getUser();
        });
    };
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY_LOCAL_STORAGE);
        setUser(null);
    };
    const getUser = () => {
        return kiwiApi.getUser().then((user: User) => {
            setUser(user);
            return user;
        });
    };

    React.useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY_LOCAL_STORAGE);
        if (token) {
            getUser()
                .catch(() => {
                    localStorage.removeItem(TOKEN_KEY_LOCAL_STORAGE);
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <IonSpinner color="secondary" />
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                login,
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
