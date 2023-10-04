import { Product, ProductSchema } from '../schemas/product.schema';

export const ProductHook = () => ({
    name: Product.name,
    useFactory: () => {
        ProductSchema.pre('save', function createProductSlug () {
            this.name = this.name.trim();
            this.slug = this.name.toLowerCase().replaceAll(' ', '-').replaceAll("'", '');
        });

        ProductSchema.pre(['updateOne','findOneAndUpdate'], function updateProductSlug () {
            const user = this.getUpdate() as Product;
            if (user?.name) {
                user.name = user.name.trim();
                user.slug = user.name.toLowerCase().replaceAll(' ', '-').replaceAll("'", '');
            }
        });
        
        return ProductSchema;
    }
});