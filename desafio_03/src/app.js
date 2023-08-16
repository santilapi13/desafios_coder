// Desafio 3 - Santiago Nicolas Lapiana

const express = require('express');
const ProductManager = require('./../../desafio_02/src/desafio_02');
const productManager = new ProductManager();

const PORT = 3000;
const app = express();


app.get('/products', (req, res) => {

    let resultado = productManager.getProducts();
    let {limit} = req.query;

    if (!limit)
        return res.json({status: 'ok', data: resultado});

    limit = parseInt(limit);

    if (isNaN(limit) || limit < 0)
        return res.json({status: 'error', msg: 'Parameter <limit> must be a non-negative integer'});

    resultado = resultado.slice(0, limit);
    res.json({status: 'ok', data: resultado});
});

app.get('/products/:pid', (req, res) => {
    let pid = req.params.pid;

    if (isNaN(pid) || pid <= 0)
        return res.json({status: 'error', msg: 'Parameter <limit> must be a positive integer'});

    pid = parseInt(pid);
    const resultado = productManager.getProductById(pid);
    console.log(pid);
    console.log(resultado);

    if (!resultado)
        return res.json({status: 'error', msg: 'Error - Product not found'});

    res.json({status: 'ok', data: resultado});
});

app.get('*', (req, res) => {
    res.send('error 404 - page not found');
});


app.listen(PORT, () => {
	console.log(`Server corriendo en puerto ${PORT}`);
});

/*
Acá te dejo endpoints para que pruebes:

localhost:3000/products  (retornaría los 4 productos)
localhost:3000/products?limit=a (retornaría error)
localhost:3000/products?limit=-1 (retornaría error)
localhost:3000/products?limit=0 (retornaría vacío)
localhost:3000/products?limit=1 (retornaría el primer producto)
localhost:3000/products?limit=3 (retornaría los primeros 3 productos)
localhost:3000/products/a (retornaría error)
localhost:3000/products/0 (retornaría error)
localhost:3000/products/1 (retornaría el primer producto)
localhost:3000/products/2 (retornaría el segundo producto)

*/