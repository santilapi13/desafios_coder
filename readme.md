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

## Probar cuentas premium
No hay front para esto. Habrá que loggearse a través de PostMan en la cuenta de admin. Luego, el admin podrá ver todos los usuarios con un GET en:
```
http://localhost:8080/api/users
```
Luego, podrá fijarse el _id del usuario al que le quiera cambiar el rol, y esto lo hará luego conun PUT en:
```
http://localhost:8080/api/users/:uid
```
Finalmente, con otro get de los usuarios se podrá corroborar que el rol cambió efectivamente.

Hay un tema con las vistas del usuario Premium. Tiene acceso a las vistas del administrador por cómo hice el front. Sugiero no usar las vistas, sino los endpoints para checkear que todo ande como debe.

## Probar carga de documentos con multer y cuentas premium
Todos los usuarios en su vista profile pueden cargar documentos (seleccionando el tipo en un menú desplegable, por ej. foto de perfil, DNI, etc.). Los documentos se guardan en el almacenamiento local,
en una carpeta uploads dentro de src, y se distribuyen en 3 subcarpetas: profiles, products y documents, según corresponda (cómo no lo pedía, las imágenes de productos aún no se pueden cargar).
Ahora, para cambiar una cuenta a premium el usuario debe tener cargados su DNI, comprobante de domicilio y comprobante de estado de cuenta. Si no los tiene, no se le permite al admin cambiar su cuenta a premium.

# TODO
- Corregir tema de variables de entorno al ejecutar node ./src/app.js vs node ./app.js (ver si se puede hacer que funcione con el primero).
