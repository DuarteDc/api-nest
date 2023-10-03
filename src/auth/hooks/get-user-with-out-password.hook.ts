import { User, UserSchema } from '../schemas/user.schema';

export const userGetWithOutPassword = () => ({
    name: User.name,
    useFactory: () => {
        UserSchema.method('toJSON', function () {
            const { password, ...user } = this.toObject();
            return user;
        });
    }
})