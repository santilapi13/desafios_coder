import express from 'express';
import {router as productsRouter} from './routes/products.router.js';
import {router as cartsRouter} from './routes/carts.router.js';
import {router as viewsRouter} from './routes/views.router.js';
import {router as sessionsRouter} from './routes/sessions.router.js';
import handlebars from 'express-handlebars';
import __dirname from './util.js';
import {Server} from 'socket.io'
import mongoose from "mongoose"
import session from "express-session";
import MongoStore from "connect-mongo";

const PORT = 8080;
const app = express();

const dbURL = "mongodb+srv://santilapiana02:aHGwx1LOTFj9kMur@e-commerce.un2yreb.mongodb.net/?retryWrites=true&w=majority"
export const secretKey = "hanskfn9832h";

app.use(session({
    store: MongoStore.create({
		mongoUrl: dbURL,
		mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
		ttl: 3600
	}),
	secret: secretKey,
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

app.get('*', (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.status(404).send('error 404 - page not found');
});

const serverExpress = app.listen(PORT, () => {
    console.log(`Server corriendo en puerto ${PORT}`);
});

mongoose.connect(dbURL)
    .catch((error) => {
        console.log("Cannot connect to database " + error);
        process.exit();
    });

export const io = new Server(serverExpress);

io.on('connection', (socket) => {
    console.log(`Client with id ${socket.id} has connected`);
});