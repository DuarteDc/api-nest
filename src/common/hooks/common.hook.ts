
import { AsyncModelFactory } from '@nestjs/mongoose';

import { userHook } from 'src/auth/hooks/user.hook';
import { categoryHook } from 'src/categories/hooks/category.hook';
import { ProductHook } from 'src/products/hooks/product.hook';

export const getMongoHooks = (): AsyncModelFactory[] => [
    ProductHook(),
    userHook(),
    categoryHook(),
]
