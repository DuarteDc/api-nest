import { Product, ProductSchema } from '../schemas/product.schema';

export const updateProductSlug = () => ({
    name: Product.name,
    useFactory: () => {
        ProductSchema.pre(['updateOne', 'findOneAndUpdate', 'findOneAndUpdate'], function () {
            const user = this.getUpdate() as Product;
            if (user?.name) {
                user.name = user.name.trim();
                user.slug = user.name.toLowerCase().replaceAll(' ', '-').replaceAll("'", '');
            }
        });
        return ProductSchema;
    }
});