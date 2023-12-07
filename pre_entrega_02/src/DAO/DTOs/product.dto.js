export default class ProductDTO {
	constructor(product) {
        if (!this.validateProps(product))
            throw new Error("Missing parameters (title, description, code, price, status, stock, category, owner are required)");

        this.title = product.title;
        this.description = product.description;
        this.code = product.code;
        this.price = parseFloat(product.price);
        this.status = !!product.status;
        this.stock = parseInt(product.stock);
        this.category = product.category;
        this.thumbnail = product.thumbnail;
        this.owner = product.owner;
	}

    validateProps = (product) => {
        let newProductProps = Object.keys(product);
        let validator = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'owner'];
        for (const toValidateProp of validator) {
            if (!newProductProps.includes(toValidateProp))
                return false;
        };
        return true;
    }
}