import express from 'express';

import { ProductsRouter } from './routes/products.router.js';
import { CartsRouter } from './routes/carts.router.js';
import { SessionsRouter } from './routes/sessions.router.js';
import { ViewsRouter } from './routes/views.router.js';
import { MocksRouter } from './routes/mocks.router.js';

import { initializePassport } from './config/passport.config.js'
import passport from 'passport';
import cookieParser from 'cookie-parser';

import handlebars from 'express-handlebars';
import __dirname from './util.js';
import { Server } from 'socket.io'
import mongoose from "mongoose"
import { config } from './config/dotenv.config.js';

const PORT = config.PORT;
const MONGO_URL = config.MONGO_URL;

const app = express();

const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
const sessionsRouter = new SessionsRouter();
const viewsRouter = new ViewsRouter();
const mocksRouter = new MocksRouter();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
//app.use(passport.session());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/api/sessions", sessionsRouter.getRouter());
app.use("/mockingproducts", mocksRouter.getRouter());
app.use("/", viewsRouter.getRouter());

const serverExpress = app.listen(PORT, () => {
    console.log(`Server corriendo en puerto ${PORT}`);
});

mongoose.connect(MONGO_URL)
    .catch((error) => {
        console.log("Cannot connect to database " + error);
        process.exit();
    });

export const io = new Server(serverExpress);

io.on('connection', (socket) => {
    console.log(`Client with id ${socket.id} has connected`);
});

serverExpress.on('error', (error) => console.log(error));