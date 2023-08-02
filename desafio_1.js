// Desafio 1 - Santiago Nicolas Lapiana

class ProductManager {

    static lastId = 1;    // Id autoincrementable

    constructor() {
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        if (title === undefined || description === undefined || price === undefined || thumbnail === undefined || code === undefined || stock === undefined)
            return console.log('ERROR: provided data is not enough to add a product');

        if (this.products.find(product => product.code === code) !== undefined)
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

        this.products.push(newProduct);
    }

    getProducts = () => this.products;

    getProductById = id => {
        let product = this.products.find(product => product.id === id);
        if (product === undefined) {
            console.log(`Product with id ${id} not found`);    
        }
        return product;
    };

}


let productManager = new ProductManager();

// PRUEBAS DE ERRORES POR FALTA DE DATOS
console.log("\nPruebas de errores por falta de datos:");
productManager.addProduct();
productManager.addProduct('Product 1');
productManager.addProduct('Product 1', 'Description 1');
productManager.addProduct('Product 1', 'Description 1', 100);
productManager.addProduct('Product 1', 'Description 1', 100, './image1.jpg');
productManager.addProduct('Product 1', 'Description 1', 100, './image1.jpg', 1);

// PRUEBAS DE AGREGADO CORRECTO
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

