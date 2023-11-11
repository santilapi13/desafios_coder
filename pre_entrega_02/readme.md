# Vistas significativas
Aclaración: hay un único carrito con el cual interactuará todo usuario que ingrese en la página, todavía no hay un carrito por usuario.
## /login
Esta vista es la que se muestra al ingresar a la página. Tiene un formulario para ingresar el usuario y contraseña, y un botón para registrarse. Si se ingresa un usuario y contraseña válidos, se redirige a la vista de productos. Si se ingresa un usuario y contraseña inválidos, se muestra un mensaje de error.
## /register
Esta vista tiene un formulario para ingresar los datos de un nuevo usuario. Si se ingresa un usuario válido, se redirige a la vista de productos. Si se ingresa un usuario inválido, se muestra un mensaje de error.
## /products
Lista todos los productos cargados. Se puede filtrar por categoría y disponibilidad, y ordenar por precio (por query param, no hay botón). Además, se puede seleccionar el tamaño de la pag.
Además, tiene los botones para agregar 1 unidad de ese producto a un carrito hardcodeado que tiene el href para ir a su correspondiente vista.
## /products/:pid
A esta vista se puede llegar apretando en los nombres de los productos en la vista anterior. Muestra la información del producto seleccionado, y tiene un botón para agregar 1 unidad de ese producto al carrito hardcodeado.
## /carts/:cid
Esta vista muestra el contenido del correspondiente carrito. Se puede acceder a la del carrito de prueba mediante botones en las anteriores vistas.

# TODO
- Testear proceso de compra completo.
- Revisar lo del "chat de usuarios".
- Crear un admin y testear que sólo él pueda crear, actualizar y eliminar productos.
- Modificar vistas para que, al momento de añadir productos a un carrito, se añadan al carrito del usuario de la sesión actual y no al hardcodeado.
- Corregir tema de variables de entorno al ejecutar node ./src/app.js vs node ./app.js (ver si se puede hacer que funcione con el primero).