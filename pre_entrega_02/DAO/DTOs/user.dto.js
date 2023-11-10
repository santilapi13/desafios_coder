import { createHash } from "../../src/util.js";

export default class UserDTO {
	constructor(product) {
        console.log(product)
        const { first_name, last_name, email, age, password } = product;
        if (!first_name || !last_name || !email || !age || !password)
            throw new Error("Missing data");

        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.age = parseInt(age);
        this.password = createHash(password);
	}
}