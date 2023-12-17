import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const request = supertest("http://localhost:8080");

describe("Test de sesiones", function() {
    this.timeout(6000);
    let adminCookie;
    let userCookie;
    let mockUser = {
        first_name: "NombrePrueba",
        last_name: "ApellidoPrueba",
        age: 20,
        email: "prueba@correo.com",
        password: "prueba123"
    }

    before(async () => {
        const mockUser = {
            email: "adminCoder@coder.com",
            password: "adminCod3r123"
        }

        const loginResponse = await request.post("/api/sessions/login").send(mockUser);
        const cookieResult = loginResponse.headers['set-cookie'][0];

        adminCookie = {
			name: cookieResult.split('=')[0],
			value: cookieResult.split('=')[1]
		}
    });

    it("Registrar un nuevo usuario con método POST en endpoint /api/sessions/register", async () => {
        // Luego del test, borrar manualmente de la BD el usuario y carrito creados.
        await request.post("/api/sessions/register").send(mockUser);

        const response = await request.get("/api/users").set('Cookie', [`${adminCookie.name} = ${adminCookie.value}`]);
        const user = response.body.payload.find(user => user.email === mockUser.email);
        expect(user).to.be.ok;
        expect(user.first_name).to.be.equal(mockUser.first_name);
        expect(user.last_name).to.be.equal(mockUser.last_name);
        expect(user.age).to.be.equal(mockUser.age);
        expect(user.password).to.not.be.equal(mockUser.password);
        expect(user.role).to.be.equal("user");
        expect(user.cart).to.be.ok;
    });

    it("Iniciar sesión y obtener token de autorización", async () => {
        const mockLogin = {
            email: mockUser.email,
            password: mockUser.password
        }

        const loginResponse = await request.post("/api/sessions/login").send(mockLogin);

        expect(loginResponse.statusCode).to.equal(200);

        const cookieResult = loginResponse.headers['set-cookie'][0];
        expect(cookieResult).to.be.ok;
        
        userCookie = {
			name: cookieResult.split('=')[0],
			value: cookieResult.split('=')[1]
		}

		expect(userCookie.name).to.be.ok.and.eql('coderCookie');
		expect(userCookie.value).to.be.ok; 
    });

    it("Cerrar sesión con método GET en endpoint /api/sessions/logout", async () => {
        const response = await request.get("/api/sessions/logout").set('Cookie', [`${userCookie.name} = ${userCookie.value}`]);
        expect(response.statusCode).to.equal(200);
    });

});