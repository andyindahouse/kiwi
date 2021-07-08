import {FullUser} from './models/user';

declare global {
    namespace Express {
        type User = FullUser;
    }
}
