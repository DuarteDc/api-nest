import { User, UserSchema } from '../schemas/user.schema';

export const userPreSave = () => ({
    name: User.name,
    useFactory: () => {
        UserSchema.pre('save', function () {
            this.email = this.email.toLowerCase()
        });
        return UserSchema;
    }
})