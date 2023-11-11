const deleteProductButton = document.querySelectorAll(".btn-delete");

const protocol = window.location.protocol;
const host = window.location.host;
const baseUrl = `${protocol}//${host}`;

deleteProductButton.forEach(button => {
    button.addEventListener("click", function() {
        const product_id = this.getAttribute("data-product-id");
    
        fetch(`${baseUrl}/api/products/${product_id}`, {
            method: "DELETE",
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