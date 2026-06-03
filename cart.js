document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const subtotalBox = document.getElementById("subtotalBox");
    const totalItemsText = document.getElementById("totalItemsText");
    const totalPriceText = document.getElementById("totalPriceText");

    function renderCart() {
        const cartCountElements = document.querySelectorAll(".cartCount");
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(el => el.textContent = totalQty);

        if (totalItemsText) totalItemsText.textContent = totalQty;

        if (cart.length === 0) {
            if (cartItemsContainer) cartItemsContainer.innerHTML = "";
            if (emptyCartMessage) emptyCartMessage.style.display = "block";
            if (subtotalBox) subtotalBox.style.display = "none";
            return;
        }

        if (emptyCartMessage) emptyCartMessage.style.display = "none";
        if (subtotalBox) subtotalBox.style.display = "block";

        let totalCartPrice = 0;
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = "";
            
            cart.forEach((item, index) => {
                const itemTotalPrice = item.price * item.quantity;
                totalCartPrice += itemTotalPrice;

                const itemRow = document.createElement("div");
                itemRow.className = "cart-item";
                itemRow.innerHTML = `
                    <img src="${item.imgUrl}" class="cart-item-img" alt="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div style="font-size: 13px; color: #555;">Weight: ${item.weight}</div>
                        <div class="cart-item-price">₹${item.price} <span style="font-size: 13px; color: #555; font-weight: normal;">(x${item.quantity})</span></div>
                        <div class="cart-action-row">
                            <div class="quantity-selector" style="display: inline-block; margin: 0;">
                                <select class="cart-qty-select" data-index="${index}">
                                    <option value="1" ${item.quantity === 1 ? 'selected' : ''}>1</option>
                                    <option value="2" ${item.quantity === 2 ? 'selected' : ''}>2</option>
                                    <option value="3" ${item.quantity === 3 ? 'selected' : ''}>3</option>
                                    <option value="4" ${item.quantity === 4 ? 'selected' : ''}>4</option>
                                    <option value="5" ${item.quantity === 5 ? 'selected' : ''}>5</option>
                                </select>
                            </div>
                            <button class="delete-item-btn" data-index="${index}">Delete</button>
                        </div>
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: #111; min-width: 80px; text-align: right;">₹${itemTotalPrice}</div>
                `;
                cartItemsContainer.appendChild(itemRow);
            });
        }

        if (totalPriceText) totalPriceText.textContent = `₹${totalCartPrice}`;
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-item-btn")) {
                const index = parseInt(e.target.getAttribute("data-index"));
                cart.splice(index, 1);
                localStorage.setItem("userCart", JSON.stringify(cart));
                renderCart();
            }
        });

        cartItemsContainer.addEventListener("change", (e) => {
            if (e.target.classList.contains("cart-qty-select")) {
                const index = parseInt(e.target.getAttribute("data-index"));
                const newQty = parseInt(e.target.value);
                cart[index].quantity = newQty;
                localStorage.setItem("userCart", JSON.stringify(cart));
                renderCart();
            }
        });
    }

    renderCart();
});