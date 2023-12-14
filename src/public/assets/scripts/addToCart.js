const button = document.getElementById("btn-add-to-cart");

const protocol = window.location.protocol;
const host = window.location.host;

const baseUrl = `${protocol}//${host}`;

button.addEventListener("click", function() {
  const product_id = this.getAttribute("data-product-id");
  const cart_id = this.getAttribute("data-cart-id");
  
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
    console.log("Respuesta:", data);
  })
  .catch(error => {
    console.error("Error:", error.message);
  });
});