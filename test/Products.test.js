import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const request = supertest("http://localhost:8080");

describe("Test de productos", function() {
    this.timeout(6000);
    let cookie;
    let products;
    let numberOfProducts;
    let pid;
    let newProduct;
    let userId;

    const mockProduct = {
        title: "Producto de prueba",
        description: "Producto de prueba",
        code: "123456",
        price: 100,
        stock: 10,
        thumbnails: ["imagenDePrueba.png"],
        category: "Producto de prueba"
    }

    before(async () => {
        const mockUser = {
            email: "adminCoder@coder.com",
            password: "adminCod3r123"
        }

        const loginResponse = await request.post("/api/sessions/login").send(mockUser);
        const cookieResult = loginResponse.headers['set-cookie'][0];

        cookie = {
			name: cookieResult.split('=')[0],
			value: cookieResult.split('=')[1]
		}

        const response = await request.get("/api/sessions/current").set('Cookie', [`${cookie.name} = ${cookie.value}`]);
        userId = response.body.payload._id;
    })

    it("Obtener todos los productos con método GET en endpoint /api/products.", async () => {
        const response = await request.get("/api/products").set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { body, statusCode } = response;

        expect(statusCode).to.be.equal(200);
        expect(body.payload.products).to.be.an("array");

        if (body.payload.products) {
            body.payload.products.forEach(product => {
                expect(product).to.include.keys("_id", "title", "description", "code", "price", "status", "stock", "category", "thumbnail", "owner");
            })
        }

        products = body.payload.products;
        numberOfProducts = body.payload.products.length;
    });

    it("Obtener todos los productos filtrando por limit", async () => {
        const limit = 2;

        const response = await request.get(`/api/products?limit=${limit}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { body, statusCode } = response;

        expect(statusCode).to.be.equal(200);
        expect(body.payload.products).to.be.an("array");

        const numberOfFilteredProducts = body.payload.products.length;
        expect(numberOfFilteredProducts).to.be.equal(limit);

        const expectedPages = Math.ceil(numberOfProducts / limit);
        expect(expectedPages).to.be.equal(body.payload.totalPages);
    });

    it("Obtener todos los productos filtrando por page", async () => {
        const limit = 1;
        const page = 2;

        const response = await request.get(`/api/products?page=${page}&limit=${limit}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { body, statusCode } = response;

        expect(statusCode).to.be.equal(200);
        expect(body.payload.products).to.be.an("array");
        expect(body.payload.prevPage).to.be.equal(page - 1);
        expect(body.payload.nextPage).to.be.equal(page + 1);
    });

    it("Obtener todos los productos ordenados por precio en forma ascendente", async () => {
        const response = await request.get("/api/products?sort=asc").set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { body, statusCode } = response;

        expect(statusCode).to.be.equal(200);
        expect(body.payload.products).to.be.an("array");
        
        for (let i = 1; i < body.payload.products.length - 1; i++) {
            expect(body.payload.products[i - 1].price).to.be.at.most(body.payload.products[i].price);
        }
    })

    it("Obtener todos los productos ordenados por precio en forma descendente", async () => {
        const response = await request.get("/api/products?sort=desc").set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { body, statusCode } = response;

        expect(statusCode).to.be.equal(200);
        expect(body.payload.products).to.be.an("array");
        
        for (let i = 1; i < body.payload.products.length - 1; i++) {
            expect(body.payload.products[i - 1].price).to.be.at.least(body.payload.products[i].price);
        }
    });

    it("Obtener todos los productos filtrando por categoria", async () => {
        const category = "Galletitas";

        const response = await request.get(`/api/products?query=${category}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { body, statusCode } = response;

        expect(statusCode).to.be.equal(200);
        expect(body.payload.products).to.be.an("array");

        body.payload.products.forEach(product => {
            expect(product.category).to.be.equal(category);
        });
    });

    it("Crear un producto con método POST en endpoint /api/products.", async () => {
        const response = await request.post("/api/products").send(mockProduct).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { body, statusCode } = response;

        expect(statusCode).to.be.equal(200);
        expect(body.payload).to.be.an("object");
        expect(body.payload).to.include.keys("_id", "title", "description", "code", "price", "status", "stock", "category", "thumbnail", "owner");
        expect(body.payload.owner).to.be.equal(userId);
        pid = body.payload._id;
        newProduct = body.payload;
        products.push(body.payload);
        numberOfProducts++;
    });

    it("Error al crear un producto con datos faltantes.", async () => {
        mockProduct.title = undefined;

        const response = await request.post("/api/products").send(mockProduct).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { statusCode } = response;

        expect(statusCode).to.be.equal(400);

        const response2 = await request.get("/api/products").set('Cookie', [`${cookie.name} = ${cookie.value}`]);
        const { body } = response2;
        expect(body.payload.products.length).to.be.equal(numberOfProducts);
    });

    it("Error al crear un producto con codigo repetido.", async () => {
        const response = await request.post("/api/products").send(mockProduct).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { statusCode } = response;

        expect(statusCode).to.be.equal(400);

        const response2 = await request.get("/api/products").set('Cookie', [`${cookie.name} = ${cookie.value}`]);
        const { body } = response2;
        expect(body.payload.products.length).to.be.equal(numberOfProducts);
    });

    it("Obtener un producto por su id con método GET en endpoint /api/products/:id.", async () => {
        const response = await request.get(`/api/products/${pid}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { body, statusCode } = response;

        expect(statusCode).to.be.equal(200);
        expect(body.payload).to.be.an("object");
        expect(body.payload).to.include.keys("_id", "title", "description", "code", "price", "status", "stock", "category", "thumbnail", "owner");
        expect(body.payload._id).to.be.equal(pid);
        expect(body.payload).to.be.eql(newProduct);
    });

    it("Error al obtener un producto por id inexistente e invalida.", async () => {
        let fakePid = "123456";
        const response = await request.get(`/api/products/${fakePid}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        let { statusCode } = response;

        expect(statusCode).to.be.equal(400);

        fakePid = "507f1f77bcf86cd799439011";
        const response2 = await request.get(`/api/products/${fakePid}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);
        statusCode = response2.statusCode;

        expect(statusCode).to.be.equal(400);
    });

    it("Actualizar un producto con método PUT en endpoint /api/products/:id.", async () => {
        const newTitle = "Producto de prueba actualizado";
        const response = await request.put(`/api/products/${pid}`).send({title: newTitle}).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { body, statusCode } = response;

        expect(statusCode).to.be.equal(200);
        expect(body.payload).to.be.an("object");
        expect(body.payload).to.include.keys("_id", "title", "description", "code", "price", "status", "stock", "category", "thumbnail", "owner");
        expect(body.payload.title).to.be.equal(newTitle);
        expect(body.payload._id).to.be.equal(pid);
    });

    it("Eliminar un producto con método DELETE en endpoint /api/products/:id.", async () => {
        const response = await request.delete(`/api/products/${pid}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { body, statusCode } = response;

        expect(statusCode).to.be.equal(200);
        
        const response2 = await request.get("/api/products").set('Cookie', [`${cookie.name} = ${cookie.value}`]);
        const { body: body2 } = response2;
        expect(body2.payload.products.length).to.be.equal(numberOfProducts - 1);
        expect(body2.payload.products).to.not.include(newProduct);
    });

    after(async () => {
        await request.delete(`/api/products/${pid}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);
    });
});