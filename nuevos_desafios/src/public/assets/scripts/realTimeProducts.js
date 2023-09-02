const socket = io();

socket.on("list-updated", data => {
	console.log(data.msg);

	const productList = document.getElementById('products');

	productList.innerHTML = "";
	data.products.forEach(product => {
		const productItem = document.createElement('li');
		productItem.innerHTML = `
			<ul>
				<li>ID: ${product.id}</li>
				<li>Nombre: ${product.title}</li>
				<li>Precio: ${product.price}</li>
				<li>Código: ${product.code}</li>
				<li>Categoría: ${product.category}</li>
				<li>Descripción: ${product.description}</li>
				<li>Stock: ${product.stock}</li>
			</ul>
			<br>
		`;
		productList.appendChild(productItem);
	});
});