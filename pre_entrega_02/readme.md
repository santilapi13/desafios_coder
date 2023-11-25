# Vistas significativas
## /login
Esta vista es la que se muestra al ingresar a la página. Tiene un formulario para ingresar el usuario y contraseña, y un botón para registrarse. Si se ingresa un usuario y contraseña válidos, se redirige a la vista de productos. Si se ingresa un usuario y contraseña inválidos (o incompletos), se muestra un mensaje de error.
Además, existe un proceso de autenticación mediante GitHub.
## /register
Esta vista tiene un formulario para ingresar los datos de un nuevo usuario. Si se ingresa un usuario válido, se redirige a la vista de productos. Si se ingresa un usuario inválido, se muestra un mensaje de error.
## /products
Muestra el nombre del usuario logeado y su rol (user o admin). Lista todos los productos cargados. Se puede filtrar por categoría y disponibilidad, 
y ordenar por precio (por query param, no hay botón). Además, se puede seleccionar el tamaño de la pag.
En caso de que el usuario logeado sea de rol "user", podrá añadir productos a su carrito. Si es un "admin" permite agregar nuevos productos o eliminar los ya existentes.
## /products/:pid
A esta vista se puede llegar apretando en los nombres de los productos en la vista anterior. Muestra la información del producto seleccionado.
En caso de estar logeado con un "user", permite agregar 1 unidad del producto al carrito. Si es un "admin", permite modificar la información del producto.
## /carts/:cid
Esta vista muestra el contenido del correspondiente carrito. Se puede acceder a la del carrito de prueba mediante botones en las anteriores vistas.
Además, permite visualizar el precio total y finalizar la compra, restando el stock a los stocks de cada producto, en caso de que alcance, y sino los deja en el carrito.

### Cuenta administrador
- Email: adminCoder@coder.com
- adminCod3r123

# TODO
- Corregir tema de variables de entorno al ejecutar node ./src/app.js vs node ./app.js (ver si se puede hacer que funcione con el primero).
