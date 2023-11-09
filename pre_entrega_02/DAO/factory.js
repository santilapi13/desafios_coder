import { config } from "../src/config/dotenv.config.js";

let Products, Carts, Users;
switch (config.PERSISTENCE) {
    case "MONGO":
        Products = await import('./productsMongoDAO.js');
        Products = Products.ProductsMongoDAO;
        Carts = await import('./cartsMongoDAO.js');
        Carts = Carts.CartsMongoDAO;
        Users = await import('./usersMongoDAO.js');
        Users = Users.UsersMongoDAO;
        break;

    case "FS":
        // TODO: Implementar por FS.
        Products = await import('./productsFsDAO.js');
        Products = Products.ProductsFsDAO;
        Carts = await import('./cartsFsDAO.js');
        Carts = Carts.CartsFsDAO;
        Users = await import('./usersFsDAO.js');
        Users = Users.UsersFsDAO;
        break;

    default: 
            throw new Error("Invalid persistence type");
}

export { Products, Carts, Users }; 