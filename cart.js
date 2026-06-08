document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const subtotalBox = document.getElementById("subtotalBox");
    const totalItemsText = document.getElementById("totalItemsText");
    const totalPriceText = document.getElementById("totalPriceText");

    const TELEGRAM_BOT_TOKEN = '8913227045:AAEtDye02cGt7YlrEGGRamkPlBLs7fuGxpU'; 
    const TELEGRAM_CHAT_ID = '8865756908';  

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

    async function sendOrderToTelegram(orderDetails) {
        let message = `🛍️ New Order Placed on Roni.in 🛍️\n\n`;
        message += `👤 Customer: ${orderDetails.customerName}\n`;
        message += `📞 Phone: ${orderDetails.customerPhone}\n`;
        message += `📧 Email: ${orderDetails.customerEmail}\n\n`;
        message += `📍 Delivery Address: \n${orderDetails.address}\n\n`;
        message += `📦 Products: \n`;
        
        orderDetails.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name} (${item.weight || '1kg'}) x ${item.quantity} = ₹${item.price * item.quantity}\n`;
        });
        
        message += `\n💰 Total Amount: ₹${orderDetails.totalAmount}\n`;
        message += `💳 Payment Method: Cash on Delivery (COD)\n`;
        message += `⏳ Status: Pending`;

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message
                })
            });

            const resData = await response.json();

            if (response.ok && resData.ok) {
                alert("আপনার অর্ডারটি সফলভাবে সাবমিট হয়েছে! খুব শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।");
                localStorage.removeItem("userCart");
                window.location.href = "index.html";
            } else {
                alert(`টেলিগ্রাম এরর: ${resData.description || 'Unknown Error'}`);
            }
        } catch (error) {
            console.error("Detailed Error:", error);
            alert(`কানেকশন এরর: ${error.message}\nদয়া করে বটের Token এবং Chat ID চেক করুন।`);
        }
    }

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("আপনার কার্ট একদম খালি! দয়া করে কিছু প্রোডাক্ট যোগ করুন।");
                return;
            }

            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!loggedInUser) {
                alert("অর্ডার সম্পূর্ণ করতে দয়া করে প্রথমে আপনার অ্যাকাউন্টে লগইন করুন!");
                window.location.href = "index.html";
                return;
            }

            const addressInput = document.getElementById("deliveryAddress");
            const addressText = addressInput ? addressInput.value.trim() : "";
            if (addressText === "") {
                alert("দয়া করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা (Address) লিখুন!");
                if (addressInput) addressInput.focus();
                return;
            }

            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const orderDetails = {
                customerName: loggedInUser.name || "Unknown",
                customerPhone: loggedInUser.phone || "N/A",
                customerEmail: loggedInUser.email || "N/A",
                address: addressText,
                items: cart,
                totalAmount: totalAmount
            };

            sendOrderToTelegram(orderDetails);
        });
    }

    renderCart();
});
