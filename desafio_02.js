// Desafio 2 - Santiago Nicolas Lapiana

const fs = require('fs');

class ProductManager {

    static lastId = 1;    // Id autoincrementable
    #path;

    constructor() {
        this.#path = './persistencia/desafio_02.json';
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        if (!title || !description || !price || !thumbnail || !code || !stock)
            return console.log('ERROR: provided data is not enough to add a product');

        let products = [];
        if (fs.existsSync(this.#path)) {
            products = JSON.parse(fs.readFileSync(this.#path, 'utf-8'));
        }

        if (products.find(product => product.code === code) !== undefined)
            return console.log(`ERROR: cannot add product ${title} because code ${code} already exists`);

        let newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        newProduct.id = ProductManager.lastId;
        ProductManager.lastId++;


        products.push(newProduct);
        fs.writeFileSync(this.#path, JSON.stringify(products, null, '\t'));
        console.log(`Product ${title} added successfully`);
    }

    getProducts = () => {
        let products = [];
        if (fs.existsSync(this.#path)) {
            products = JSON.parse(fs.readFileSync(this.#path, 'utf-8'));
        }
        return products;
    };

    getProductById = id => {
        let products = [];
        if (fs.existsSync(this.#path)) {
            products = JSON.parse(fs.readFileSync(this.#path, 'utf-8'));
        }

        let product = products.find(product => product.id === id);

        if (!product)
            console.log(`ERROR: Product with id ${id} not found`);

        return product;
    };

    updateProduct = (id, prop, newValue) => {
        if (!id || !newValue)
            return console.log('ERROR: provided data is not enough to update a product');

        if (prop === "id")
            return console.log('ERROR: cannot update id');

        let products = [];
        if (fs.existsSync(this.#path)) {
            products = JSON.parse(fs.readFileSync(this.#path, 'utf-8'));
        }

        if (!this.getProductById(id)) {
            return;
        }

        let product = products.find(product => product.id === id);
        if (prop === null) {
            for (const prop in newValue) {
                if (!product[prop])
                    return console.log(`ERROR: cannot update product with id ${id} because property ${prop} does not exist`);
                if (prop !== "id")
                    product[prop] = newValue[prop];
            }
        } else {
            if (!product[prop])
                return console.log(`ERROR: cannot update product with id ${id} because property ${prop} does not exist`);
            product[prop] = newValue;
        }

        products = products.filter(product => product.id !== id);
        products.push(product);

        fs.writeFileSync(this.#path, JSON.stringify(products, null, '\t'));
        console.log(`Product with id ${id} updated successfully`);
    }

    deleteProduct = id => {
        let products = [];
        if (fs.existsSync(this.#path)) {
            products = JSON.parse(fs.readFileSync(this.#path, 'utf-8'));
        }

        if (!this.getProductById(id)) {
            return;
        }

        products = products.filter(product => product.id !== id);

        fs.writeFileSync(this.#path, JSON.stringify(products, null, '\t'));
        console.log(`Product with id ${id} deleted successfully`);
    }

}



let productManager = new ProductManager();

fs.unlinkSync('./persistencia/desafio_02.json');

// PRUEBAS DE ERRORES POR FALTA DE DATOS
console.log("\nPruebas de errores por falta de datos:");
productManager.addProduct();
productManager.addProduct('Product 1');
productManager.addProduct('Product 1', 'Description 1');
productManager.addProduct('Product 1', 'Description 1', 100);
productManager.addProduct('Product 1', 'Description 1', 100, './image1.jpg');
productManager.addProduct('Product 1', 'Description 1', 100, './image1.jpg', 1);

// PRUEBAS DE AGREGADO CORRECTO
console.log("\nPruebas de agregado correcto:");
productManager.addProduct('Product 1', 'Description 1', 100, './image1.jpg', 500, 10);
productManager.addProduct('Product 2', 'Description 2', 100, './image2.jpg', 560, 10);
productManager.addProduct('Product 3', 'Description 3', 200, './image3.jpg', 320, 20);
productManager.addProduct('Product 4', 'Description 4', 150, './image4.jpg', 501, 15);

// PRUEBAS DE ERRORES POR CÓDIGO REPETIDO
console.log("\nPruebas de errores por codigo repetido:");
productManager.addProduct('Product 5', 'Description 5', 100, './image5.jpg', 500, 10);    // Repetido


// PRUEBAS DE BUSQUEDA POR ID
console.log("\nPruebas busquedas por ID:");
let product = productManager.getProductById(0);
console.log(product !== undefined ? product : ""); // No existe
product = productManager.getProductById(1);
console.log(product !== undefined ? product : ""); 
product = productManager.getProductById(2);
console.log(product !== undefined ? product : "");
product = productManager.getProductById(10);
console.log(product !== undefined ? product : ""); // No existe


console.log("\nLista de productos:");
console.log(productManager.getProducts());

// PRUEBAS DE ELIMINACION
console.log("\nPruebas de eliminacion:");
productManager.deleteProduct(0);    // No existe
productManager.deleteProduct(1);
productManager.deleteProduct(3);

console.log("\nLista de productos:");
console.log(productManager.getProducts());

// PRUEBAS DE ACTUALIZACION
console.log("\nPruebas de actualizacion:");
productManager.updateProduct(30, "title", "Product 1");    // No existe
productManager.updateProduct(4, "title", "Producto numero 4");
productManager.updateProduct(2, "id", 5);
productManager.updateProduct(2, null, { title: "Product 2", description: "Esta es la nueva descripcion del producto 2", price: 100, thumbnail: "./imagen_nueva2.jpg", code: 500, stock: 10 });

console.log("\nLista de productos:");
console.log(productManager.getProducts());