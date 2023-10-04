import { Category, CategorySchema } from '../schemas/category.schema';

export const categoryHook = () => ({
    name: Category.name,
    useFactory: () => {
        CategorySchema.pre('save', function createCategorySlug () {
            this.name = this.name.trim();
            this.slug = this.name.toLowerCase().replaceAll(' ', '-').replaceAll("'", '');
        });

        CategorySchema.pre(['updateOne', 'findOneAndUpdate'], function updateCategorySlug () {
            const category = this.getUpdate() as Category;
            if (category?.name) {
                category.name = category.name.trim();
                category.slug = category.name.toLowerCase().replaceAll('', '-').replaceAll("'", '-')
            }
        });

        return CategorySchema;
    }
});