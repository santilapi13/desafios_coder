import express from 'express';
import {router as productsRouter} from './routes/products.router.js';
import {router as cartsRouter} from './routes/carts.router.js';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get('*', (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.status(404).send('error 404 - page not found');
});

app.listen(PORT, () => {
    console.log(`Server corriendo en puerto ${PORT}`);
});

