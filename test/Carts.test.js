import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const request = supertest("http://localhost:8080");

describe("Test de carritos", function() {
    this.timeout(6000);

    let cookie;
    let cid;

    before(async () => {
        const mockUser = {
            email: "juancito@gmail.com",
            password: "123"
        }

        const loginResponse = await request.post("/api/sessions/login").send(mockUser);
        const cookieResult = loginResponse.headers['set-cookie'][0];

        cookie = {
			name: cookieResult.split('=')[0],
			value: cookieResult.split('=')[1]
		}
    });

    it("Crear un carrito vacío con método POST en endpoint /api/carts.", async () => {
        // Recordar eliminar el carrito luego del test.
        const response = await request.post("/api/carts").send({products: []}).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { body, statusCode } = response;

        expect(statusCode).to.be.equal(200);
        expect(body.payload).to.include.keys("_id", "products");
        expect(body.payload.products).to.be.an("array");
        expect(body.payload.products.length).to.be.equal(0);
    
        cid = body.payload._id;
    });

    it("Obtener un carrito con método GET en endpoint /api/carts/:cid.", async () => {
        const response = await request.get(`/api/carts/${cid}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { body, statusCode } = response;

        expect(statusCode).to.be.equal(200);
        expect(body.payload).to.include.keys("_id", "products");
        expect(body.payload.products).to.be.an("array");

        body.payload.products.forEach(product => {
            expect(product).to.include.keys("_id", "product", "quantity", "subtotal");
        })
    });

    it("Agregar un nuevo producto a un carrito con método POST en endpoint /api/carts/:cid/product/:pid.", async () => {
        // Agrega un frasco de cafe cabrales
        const pid = "65064a1363388bf0de432fe1";
        const response = await request.post(`/api/carts/${cid}/product/${pid}`).send({products: []}).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { statusCode } = response;

        expect(statusCode).to.be.equal(200);

        const { body } = await request.get(`/api/carts/${cid}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        expect(body.payload).to.include.keys("_id", "products");
        expect(body.payload.products).to.be.an("array");
        expect(body.payload.products.length).to.be.equal(1);
        expect(body.payload.products[0].product._id).to.be.equal(pid);
        expect(body.payload.products[0].quantity).to.be.equal(1);
    });

    it("Agregar un producto ya existente en un carrito con método POST en endpoint /api/carts/:cid/product/:pid.", async () => {
        // Agrega otro frasco de cafe cabrales
        const pid = "65064a1363388bf0de432fe1";
        const response = await request.post(`/api/carts/${cid}/product/${pid}`).send({products: []}).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        const { statusCode } = response;

        expect(statusCode).to.be.equal(200);

        const { body } = await request.get(`/api/carts/${cid}`).set('Cookie', [`${cookie.name} = ${cookie.value}`]);

        expect(body.payload).to.include.keys("_id", "products");
        expect(body.payload.products).to.be.an("array");
        expect(body.payload.products.length).to.be.equal(1);
        expect(body.payload.products[0].product._id).to.be.equal(pid);
        expect(body.payload.products[0].quantity).to.be.equal(2);
    });

});