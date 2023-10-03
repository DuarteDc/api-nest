import { Product, ProductSchema } from '../schemas/product.schema';

export const createProductSlug = () => ({
    name: Product.name,
    useFactory: () => {
        ProductSchema.pre('save', function () {
            this.name = this.name.trim();
            this.slug = this.name.toLowerCase().replaceAll(' ', '-').replaceAll("'", '');
        });
        return ProductSchema;
    }
});