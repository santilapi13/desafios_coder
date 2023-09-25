const button = document.getElementById("btn-add-to-cart");
const product_id = document.getElementById("product-id").textContent;
console.log(product_id)
const cart_id = document.getElementById("cart-id").textContent;
console.log(cart_id)

const protocol = window.location.protocol;
const host = window.location.host;

const baseUrl = `${protocol}//${host}`;

button.addEventListener("click", function() {
    fetch(`${baseUrl}/api/carts/${cart_id}/product/${product_id}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Query failed. Status: ${response.status}`);
      }
      return response.json(); 
    })
    .then(data => {
      // Manejar los datos de la respuesta
      console.log("Respuesta:", data);
      // Aquí puedes procesar los datos según sea necesario
    })
    .catch(error => {
      console.error("Error:", error.message);
    });
});