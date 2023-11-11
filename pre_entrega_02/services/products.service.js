import { Products as DAO } from "../DAO/factory.js"; 

class ProductsService {
    constructor(dao) {
        this.dao = new dao();
    }

    async getProducts() {
        return await this.dao.get();
    }

    async getFilteredProducts(query, limit, page, sort) {
        return await this.dao.get({limit, page, sort}, query);
    }

    async getProductById(id) {
        const product = await this.dao.get({_id:id})
        return product ? product[0] : null;
    }

    async getProductByCode(code) {
        const product = await this.dao.get({code:code})
        return product ? product[0] : null;
    }

    async createProduct(product) {
        return await this.dao.create(product)
    }

    async updateProduct(id, product) {
        return await this.dao.update(id, product);
    }

    async deleteProduct(id) {
        return await this.dao.delete({_id:id});
    }

    async validateProductId(pid) {
        return await this.dao.validateProductId(pid);
    }
}

export const productsService = new ProductsService(DAO);