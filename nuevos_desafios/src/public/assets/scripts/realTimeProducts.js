const socket = io();

socket.on("listUpdate", data => {
	console.log("La lista fue actualizada.");
	//let productsList = this.document.getElementById("products");
	//productsList.innerHTML = "";
});