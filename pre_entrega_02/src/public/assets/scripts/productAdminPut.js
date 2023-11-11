document.addEventListener('DOMContentLoaded', function() {
    const updateProductButton = document.querySelector("#btn-update");

    const protocol = window.location.protocol;
    const host = window.location.host;
    const baseUrl = `${protocol}//${host}`;

    updateProductButton.addEventListener("click", function() {
        let product_id = this.getAttribute("data-product-id");
        let title = document.querySelector("#title").value;
        let price = document.querySelector("#price").value;
        let description = document.querySelector("#description").value;
        let code = document.querySelector("#code").value;
        let category = document.querySelector("#category").value;
        let stock = document.querySelector("#stock").value;
        let status = document.querySelector("#status").value;

        fetch(`${baseUrl}/api/products/${product_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                price,
                description,
                code,
                category,
                stock,
                status
            })
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
    })
});