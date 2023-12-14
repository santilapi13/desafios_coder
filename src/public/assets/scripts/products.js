const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");
const cart_id = document.getElementById("cart-id").href.split("/").pop();

const protocol = window.location.protocol;
const host = window.location.host;

const baseUrl = `${protocol}//${host}`;

addToCartButtons.forEach(button => {
    button.addEventListener("click", function() {
        const product_id = this.getAttribute("data-product-id");
    
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
        .catch(error => {
            console.error("Error:", error.message);
        });
    });
});