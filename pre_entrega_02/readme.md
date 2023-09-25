# Vistas significativas
## /products
Lista todos los productos cargados. Se puede filtrar por categoría y disponibilidad, y ordenar por precio (por query param, no hay botón). Además, se puede seleccionar el tamaño de la pag.
Además, tiene los botones para agregar 1 unidad de ese producto a un carrito hardcodeado que tiene el href para ir a su correspondiente vista.
## /products/:pid
A esta vista se puede llegar apretando en los nombres de los productos en la vista anterior. Muestra la información del producto seleccionado, y tiene un botón para agregar 1 unidad de ese producto al carrito hardcodeado.
## /carts/:cid
Esta vista muestra el contenido del correspondiente carrito. Se puede acceder a la del carrito de prueba mediante botones en las anteriores vistas.
