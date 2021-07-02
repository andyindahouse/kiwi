import {FullUser} from './models/user';

declare global {
    namespace Express {
        interface User extends FullUser {}
    }
}
