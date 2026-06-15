document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const subtotalBox = document.getElementById("subtotalBox");
    const totalItemsText = document.getElementById("totalItemsText");
    const totalPriceText = document.getElementById("totalPriceText");
    const checkoutBtn = document.getElementById("checkoutBtn");

    const TELEGRAM_BOT_TOKEN = '8913227045:AAEtDye02cGt7YlrEGGRamkPlBLs7fuGxpU'; 
    const TELEGRAM_CHAT_ID = '8865756908'; 

    function showAlert(elementId, text, type = "error") {
        const alertBox = document.getElementById(elementId);
        if (!alertBox) return;
        alertBox.textContent = text;
        alertBox.style.display = "block";
        alertBox.style.background = type === "success" ? "#e8f5e9" : "#ffebee";
        alertBox.style.color = type === "success" ? "#2e7d32" : "#c62828";
        alertBox.style.border = "1px solid";
    }

    function renderCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = "";
        let totalQty = 0;
        let totalCartPrice = 0;

        if (cart.length === 0) {
            if (emptyCartMessage) emptyCartMessage.style.display = "block";
            if (subtotalBox) subtotalBox.style.display = "none";
            return;
        }

        if (emptyCartMessage) emptyCartMessage.style.display = "none";
        if (subtotalBox) subtotalBox.style.display = "block";

        cart.forEach((item, index) => {
            totalQty += item.quantity;
            totalCartPrice += (item.price * item.quantity);

            const itemDiv = document.createElement("div");
            itemDiv.className = "cart-item-row";
            itemDiv.style.cssText = "display:flex; align-items:center; gap:15px; padding:15px; border-bottom:1px solid #ddd; flex-wrap:wrap;";
            
            itemDiv.innerHTML = `
                <img src="${item.imgUrl}" style="width:70px; height:70px; object-fit:cover; border-radius:5px;">
                <div style="flex:1;">
                    <div style="font-weight:bold;">${item.name}</div>
                    <div style="font-size:12px; color:#666;">Weight: ${item.weight}</div>
                    <div style="margin-top:5px;">
                        <select class="qty-select" data-index="${index}" style="padding:5px;">
                            ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${item.quantity == n ? 'selected' : ''}>${n}</option>`).join('')}
                        </select>
                        <button class="delete-btn" data-index="${index}" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; cursor:pointer; margin-left:10px;">Delete</button>
                    </div>
                </div>
                <div style="font-weight:bold; font-size:16px;">₹${item.price * item.quantity}</div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        if (totalItemsText) totalItemsText.textContent = totalQty;
        if (totalPriceText) totalPriceText.textContent = `₹${totalCartPrice}`;
        document.querySelectorAll(".cartCount").forEach(el => el.textContent = totalQty);
    }

    cartItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            cart.splice(e.target.getAttribute("data-index"), 1);
            localStorage.setItem("userCart", JSON.stringify(cart));
            renderCart();
        }
    });

    cartItemsContainer.addEventListener("change", (e) => {
        if (e.target.classList.contains("qty-select")) {
            cart[e.target.getAttribute("data-index")].quantity = parseInt(e.target.value);
            localStorage.setItem("userCart", JSON.stringify(cart));
            renderCart();
        }
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            document.getElementById("mainAlertMsg").style.display = "none";
            const address = document.getElementById("deliveryAddress").value.trim();
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            
            if (!loggedInUser) return showAlert("mainAlertMsg", "লগইন করুন!", "error");
            if (address === "") return showAlert("mainAlertMsg", "ঠিকানা লিখুন!", "error");

            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            const orderDetails = { 
                customerName: loggedInUser.name, 
                customerPhone: loggedInUser.phone, 
                address: address, 
                items: cart, 
                totalAmount: totalAmount, 
                paymentMethod: "Cash on Delivery (COD)" 
            };

            sendOrderToTelegram(orderDetails);
        });
    }

    async function sendOrderToTelegram(details) {
        let msg = `🛍️ New Order: ${details.customerName}\n📞 ${details.customerPhone}\n📍 ${details.address}\n💳 ${details.paymentMethod}\n`;
        details.items.forEach(i => msg += `• ${i.name} (${i.quantity})\n`);
        msg += `💰 Total: ₹${details.totalAmount}`;

        try {
            showAlert("mainAlertMsg", "অর্ডার প্রসেস হচ্ছে...", "info");
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({chat_id: TELEGRAM_CHAT_ID, text: msg})
            });
            showAlert("mainAlertMsg", "অর্ডার সফল!", "success");
            localStorage.removeItem("userCart");
            setTimeout(() => window.location.href = "index.html", 2000);
        } catch (e) {
            showAlert("mainAlertMsg", "নেটওয়ার্ক সমস্যা!", "error");
        }
    }

    renderCart();
});
