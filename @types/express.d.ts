import { UserDetailsProps } from '../src/types/user.type'

declare global {
    namespace Express {
        interface Request {
            user?: Omit<UserDetailsProps, 'password'>;
        }
    }
}