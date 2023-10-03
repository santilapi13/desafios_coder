import { productModel } from './models/product.model.js';

class ProductManagerDB {

    getProducts = async (query, limit, page, sort) => {
        let resultado = await productModel.paginate(query, {limit, lean: true, page, sort});
        const maxPages = resultado.totalPages;

        if (page > maxPages) {
            page = maxPages;
            resultado = await productModel.paginate(query, {limit, lean: true, page, sort});
        }

        return resultado;
    }

}

export default ProductManagerDB;