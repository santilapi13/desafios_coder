const deleteProductsFromCartButtons = document.querySelectorAll(".btn-delete-from-cart");
const addOneProductToCartButtons = document.querySelectorAll(".btn-add-one");
const cartId = document.querySelector("#cart-id").getAttribute("data-cart-id");

const protocol = window.location.protocol;
const host = window.location.host;

const baseUrl = `${protocol}//${host}`;

addOneProductToCartButtons.forEach(button => {
    button.addEventListener("click", function() {
        console.log("CLICK EN AGREGAR")
        const productId = this.getAttribute("data-product-id");
    
        fetch(`${baseUrl}/api/carts/${cartId}/product/${productId}`, {
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

deleteProductsFromCartButtons.forEach(button => {
    button.addEventListener("click", function() {
        console.log("CLICK EN ELIMINAR")
        const productId = this.getAttribute("data-product-id");
    
        fetch(`${baseUrl}/api/carts/${cartId}/products/${productId}`, {
            method: "DELETE",
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