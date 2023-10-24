import { Product } from 'src/products/schemas/product.schema';

export interface OrderProduct extends Product {
    quantity: number,
}