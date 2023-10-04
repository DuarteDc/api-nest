import { User, UserSchema } from '../schemas/user.schema';

export const userHook = () => ({
    name: User.name,
    useFactory: () => {
        UserSchema.method('toJSON', function getUserWithOutPassword () {
            const { password, ...user } = this.toObject();
            return user;
        });

        UserSchema.pre('save', function parseUserEmail () {
            this.email = this.email.toLowerCase()
        });

        return UserSchema;
    }
})