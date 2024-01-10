const changeRoleButtons = document.querySelectorAll('.btn-change-role');
const deleteButtons = document.querySelectorAll('.btn-delete');
const deleteInactivesButton = document.getElementById('btn-delete-inactives');

const protocol = window.location.protocol;
const host = window.location.host;
const baseUrl = `${protocol}//${host}`;

changeRoleButtons.forEach(button => {
    button.addEventListener("click", function() {
        const uid = this.getAttribute("user-id");
    
        fetch(`${baseUrl}/api/users/premium/${uid}`, {
            method: "PUT",
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

deleteButtons.forEach(button => {
    button.addEventListener("click", function() {
        const uid = this.getAttribute("user-id");
    
        fetch(`${baseUrl}/api/users/${uid}`, {
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

deleteInactivesButton.addEventListener("click", function() {
    fetch(`${baseUrl}/api/users/`, {
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