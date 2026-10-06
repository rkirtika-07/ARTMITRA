let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];


/* Open Login */

function openLogin() {
    document.getElementById("loginPopup").style.display = "flex";
    document.getElementById("registerPopup").style.display = "none";
}


/* Open Register */

function openRegister() {
    document.getElementById("registerPopup").style.display = "flex";
    document.getElementById("loginPopup").style.display = "none";
}


/* Close Popup */

function closePopup() {
    document.getElementById("loginPopup").style.display = "none";
    document.getElementById("registerPopup").style.display = "none";
}


/* Switch Login */

function switchToLogin() {
    openLogin();
}


/* Switch Register */

function switchToRegister() {
    openRegister();
}


/* Register */

function register() {

    let name = document.getElementById("registerName").value;
    let email = document.getElementById("registerEmail").value;
    let password = document.getElementById("registerPassword").value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill all fields.");
        return;
    }

    let user = {
        name: name,
        email: email,
        password: password,
        role: "user"
    };

    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");

    document.getElementById("registerName").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPassword").value = "";

    openLogin();
}


/* Login */

function login() {

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;
    let role = document.getElementById("loginRole").value;

    if (role === "admin") {

        if (email === "admin@gmail.com" && password === "admin123") {

            localStorage.setItem("currentRole", "admin");

            window.location.href = "admin.html";

        } else {

            alert("Invalid Admin login.");

        }

        return;
    }


    if (role === "manager") {

        if (email === "manager@gmail.com" && password === "manager123") {

            localStorage.setItem("currentRole", "manager");

            window.location.href = "manager.html";

        } else {

            alert("Invalid Manager login.");

        }

        return;
    }


    let foundUser = users.find(function(user) {

        return user.email === email &&
               user.password === password;

    });


    if (foundUser) {

        localStorage.setItem("currentUser", JSON.stringify(foundUser));

        localStorage.setItem("currentRole", "user");

        window.location.href = "user.html";

    } else {

        alert("Invalid user login. Please register first.");

    }

}


/* Add to Cart */

function addToCart(name, price) {

    let item = {
        name: name,
        price: price
    };

    cart.push(item);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " added to cart!");

}


/* Search */

function searchArt() {

    let searchValue =
        document.getElementById("searchBox").value.toLowerCase();

    let cards =
        document.querySelectorAll(".art-card");

    cards.forEach(function(card) {

        let name =
            card.querySelector("h3").textContent.toLowerCase();

        if (name.includes(searchValue)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}


/* Filter */

function filterArt(category) {

    let cards =
        document.querySelectorAll(".art-card");

    cards.forEach(function(card) {

        if (category === "All" ||
            card.dataset.category === category) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}


/* Auction */

function placeBid(artwork) {

    let bid = prompt(
        "Enter your bid amount for " + artwork
    );

    if (bid === null || bid === "") {
        return;
    }

    if (isNaN(bid)) {

        alert("Please enter a valid amount.");

        return;
    }

    alert(
        "Your bid of ₹" +
        bid +
        " has been placed for " +
        artwork
    );

}


/* Place Order */

function placeOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {

        alert("Please login first.");

        return;

    }

    let total = 0;

    cart.forEach(function(item) {

        total += item.price;

    });


    let order = {

        id: "ART" + Date.now(),

        customer: currentUser.name,

        email: currentUser.email,

        items: cart,

        total: total,

        status: "Pending",

        date: new Date().toLocaleDateString()

    };


    orders.push(order);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    cart = [];

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert(
        "Order placed successfully!\nOrder ID: " +
        order.id
    );

    loadCart();

}


/* Load Cart */

function loadCart() {

    let cartTable =
        document.getElementById("cartTable");

    if (!cartTable) {
        return;
    }

    cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let html = "";

    let total = 0;

    cart.forEach(function(item, index) {

        total += item.price;

        html += `
            <tr>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>
                    <button onclick="removeFromCart(${index})">
                        Remove
                    </button>
                </td>
            </tr>
        `;

    });


    html += `
        <tr>
            <th colspan="1">Total</th>
            <th>₹${total}</th>
            <th></th>
        </tr>
    `;


    cartTable.innerHTML = html;

}


/* Remove Cart Item */

function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    loadCart();

}


/* Load User Orders */

function loadUserOrders() {

    let table =
        document.getElementById("userOrderTable");

    if (!table) {
        return;
    }

    orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    let html = "";

    let userOrders =
        orders.filter(function(order) {

            return order.email === currentUser.email;

        });


    userOrders.forEach(function(order) {

        let itemNames =
            order.items.map(function(item) {

                return item.name;

            }).join(", ");


        html += `
            <tr>

                <td>${order.id}</td>

                <td>${itemNames}</td>

                <td>₹${order.total}</td>

                <td>${order.date}</td>

                <td>
                    <span class="status ${order.status.toLowerCase()}">
                        ${order.status}
                    </span>
                </td>

            </tr>
        `;

    });


    if (html === "") {

        html = `
            <tr>
                <td colspan="5">
                    No orders found.
                </td>
            </tr>
        `;

    }


    table.innerHTML = html;

}


/* Load Admin Orders */

function loadAdminOrders() {

    let table =
        document.getElementById("adminOrderTable");

    if (!table) {
        return;
    }

    orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    let html = "";

    orders.forEach(function(order) {

        let itemNames =
            order.items.map(function(item) {

                return item.name;

            }).join(", ");


        html += `
            <tr>

                <td>${order.id}</td>

                <td>${order.customer}</td>

                <td>${itemNames}</td>

                <td>₹${order.total}</td>

                <td>${order.date}</td>

                <td>${order.status}</td>

            </tr>
        `;

    });


    if (html === "") {

        html = `
            <tr>
                <td colspan="6">
                    No orders available.
                </td>
            </tr>
        `;

    }


    table.innerHTML = html;

}


/* Update Order Status */

function updateOrderStatus(index, status) {

    orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    orders[index].status = status;

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    loadManagerOrders();

    alert("Order status updated.");

}


/* Load Manager Orders */

function loadManagerOrders() {

    let table =
        document.getElementById("managerOrderTable");

    if (!table) {
        return;
    }

    orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    let html = "";

    orders.forEach(function(order, index) {

        let itemNames =
            order.items.map(function(item) {

                return item.name;

            }).join(", ");


        html += `
            <tr>

                <td>${order.id}</td>

                <td>${order.customer}</td>

                <td>${itemNames}</td>

                <td>₹${order.total}</td>

                <td>${order.status}</td>

                <td>

                    <button onclick="updateOrderStatus(${index}, 'Accepted')">
                        Accept
                    </button>

                    <button onclick="updateOrderStatus(${index}, 'Rejected')">
                        Reject
                    </button>

                </td>

            </tr>
        `;

    });


    if (html === "") {

        html = `
            <tr>
                <td colspan="6">
                    No orders available.
                </td>
            </tr>
        `;

    }


    table.innerHTML = html;

}


/* Dashboard Counts */

function loadAdminDashboard() {

    orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    users =
        JSON.parse(localStorage.getItem("users")) || [];


    let totalOrders =
        document.getElementById("totalOrders");

    let pendingOrders =
        document.getElementById("pendingOrders");

    let acceptedOrders =
        document.getElementById("acceptedOrders");

    let rejectedOrders =
        document.getElementById("rejectedOrders");

    let totalUsers =
        document.getElementById("totalUsers");


    if (totalOrders)
        totalOrders.textContent = orders.length;

    if (pendingOrders)
        pendingOrders.textContent =
            orders.filter(o => o.status === "Pending").length;

    if (acceptedOrders)
        acceptedOrders.textContent =
            orders.filter(o => o.status === "Accepted").length;

    if (rejectedOrders)
        rejectedOrders.textContent =
            orders.filter(o => o.status === "Rejected").length;

    if (totalUsers)
        totalUsers.textContent = users.length;


    loadAdminOrders();

}


/* Manager Dashboard */

function loadManagerDashboard() {

    orders =
        JSON.parse(localStorage.getItem("orders")) || [];


    let managerTotal =
        document.getElementById("managerTotal");

    let managerPending =
        document.getElementById("managerPending");

    let managerAccepted =
        document.getElementById("managerAccepted");

    let managerRejected =
        document.getElementById("managerRejected");


    if (managerTotal)
        managerTotal.textContent = orders.length;

    if (managerPending)
        managerPending.textContent =
            orders.filter(o => o.status === "Pending").length;

    if (managerAccepted)
        managerAccepted.textContent =
            orders.filter(o => o.status === "Accepted").length;

    if (managerRejected)
        managerRejected.textContent =
            orders.filter(o => o.status === "Rejected").length;


    loadManagerOrders();

}


/* Add Artwork */

function addArtwork() {

    let name =
        document.getElementById("artName").value;

    let artist =
        document.getElementById("artistName").value;

    let category =
        document.getElementById("artCategory").value;

    let price =
        document.getElementById("artPrice").value;

    let description =
        document.getElementById("artDescription").value;


    if (
        name === "" ||
        artist === "" ||
        category === "" ||
        price === ""
    ) {

        alert("Please fill all required fields.");

        return;

    }


    let artworks =
        JSON.parse(localStorage.getItem("artworks")) || [];


    let artwork = {

        name: name,

        artist: artist,

        category: category,

        price: price,

        description: description

    };


    artworks.push(artwork);


    localStorage.setItem(
        "artworks",
        JSON.stringify(artworks)
    );


    alert("Artwork added successfully!");

    document.getElementById("artName").value = "";
    document.getElementById("artistName").value = "";
    document.getElementById("artPrice").value = "";
    document.getElementById("artDescription").value = "";

}


/* Page Load */

window.addEventListener("load", function() {

    loadCart();

    loadUserOrders();

    loadAdminDashboard();

    loadManagerDashboard();

});