document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const subtotalBox = document.getElementById("subtotalBox");
    const totalItemsText = document.getElementById("totalItemsText");
    const totalPriceText = document.getElementById("totalPriceText");

    const MY_UPI_ID = '9046736451-2@ybl'; 
    const TELEGRAM_BOT_TOKEN = '8913227045:AAEtDye02cGt7YlrEGGRamkPlBLs7fuGxpU'; 
    const TELEGRAM_CHAT_ID = '8865756908'; 

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let globalOrderDetails = null; 

    function showAlert(elementId, text, type = "error") {
        const alertBox = document.getElementById(elementId);
        if (!alertBox) return;
        alertBox.textContent = text;
        alertBox.style.display = "block";
        alertBox.style.background = type === "success" ? "#e8f5e9" : type === "info" ? "#e3f2fd" : "#ffebee";
        alertBox.style.color = type === "success" ? "#2e7d32" : type === "info" ? "#0d47a1" : "#c62828";
        alertBox.style.border = "1px solid";
    }

    function clearAlerts() {
        document.getElementById("mainAlertMsg").style.display = "none";
        document.getElementById("paymentAlertMsg").style.display = "none";
    }

    const checkoutBtn = document.getElementById("checkoutBtn");
    const confirmPaymentArea = document.getElementById("confirmPaymentArea");

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            clearAlerts();
            const addressInput = document.getElementById("deliveryAddress");
            const addressText = addressInput ? addressInput.value.trim() : "";
            
            if (cart.length === 0) return showAlert("mainAlertMsg", "কার্ট খালি!", "error");
            if (addressText === "") return showAlert("mainAlertMsg", "ঠিকানা লিখুন!", "error");

            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

            let orderDetails = { address: addressText, items: cart, totalAmount, paymentMethod: selectedMethod };

            if (selectedMethod === "ONLINE") {
                globalOrderDetails = orderDetails; 
                if (confirmPaymentArea) confirmPaymentArea.style.display = "block";
                
                if (isMobile) {
                    const upiUrl = `upi://pay?pa=${MY_UPI_ID}&pn=Roni_Shop&am=${totalAmount}&cu=INR`;
                    showAlert("mainAlertMsg", "পেমেন্ট অ্যাপে যাওয়া হচ্ছে...", "info");
                    setTimeout(() => { window.location.href = upiUrl; }, 1000);
                } else {
                    showAlert("mainAlertMsg", "QR স্ক্যান করে নিচে UTR নম্বর দিন।", "info");
                }
            } else {
                sendOrderToTelegram(orderDetails, "mainAlertMsg");
            }
        });
    }

});
document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const subtotalBox = document.getElementById("subtotalBox");
    const totalItemsText = document.getElementById("totalItemsText");
    const totalPriceText = document.getElementById("totalPriceText");

    const MY_UPI_ID = '9046736451-2@ybl'; 
    const TELEGRAM_BOT_TOKEN = '8913227045:AAEtDye02cGt7YlrEGGRamkPlBLs7fuGxpU'; 
    const TELEGRAM_CHAT_ID = '8865756908'; 

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let globalOrderDetails = null; 

    function showAlert(elementId, text, type = "error") {
        const alertBox = document.getElementById(elementId);
        if (!alertBox) return;
        alertBox.textContent = text;
        alertBox.style.display = "block";
        if (type === "success") {
            alertBox.style.background = "#e8f5e9";
            alertBox.style.color = "#2e7d32";
            alertBox.style.border = "1px solid #a5d6a7";
        } else if (type === "info") {
            alertBox.style.background = "#e3f2fd";
            alertBox.style.color = "#0d47a1";
            alertBox.style.border = "1px solid #90caf9";
        } else {
            alertBox.style.background = "#ffebee";
            alertBox.style.color = "#c62828";
            alertBox.style.border = "1px solid #ffcdd2";
        }
    }

    function clearAlerts() {
        const mainAlert = document.getElementById("mainAlertMsg");
        const payAlert = document.getElementById("paymentAlertMsg");
        if (mainAlert) mainAlert.style.display = "none";
        if (payAlert) payAlert.style.display = "none";
    }

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

        if (totalCartPrice > 0) {
            const upiString = `upi://pay?pa=${MY_UPI_ID}&pn=Roni_Shop&am=${totalCartPrice}&cu=INR`;
            const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiString)}`;
            
            const upiQrImg = document.getElementById("upiQrImg");
            const displayUpiId = document.getElementById("displayUpiId");
            if (upiQrImg) upiQrImg.src = qrImgUrl;
            if (displayUpiId) displayUpiId.textContent = MY_UPI_ID;
        }
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-item-btn")) {
                const index = parseInt(e.target.getAttribute("data-index"));
                cart.splice(index, 1);
                localStorage.setItem("userCart", JSON.stringify(cart));
                clearAlerts();
                renderCart();
            }
        });

        cartItemsContainer.addEventListener("change", (e) => {
            if (e.target.classList.contains("cart-qty-select")) {
                const index = parseInt(e.target.getAttribute("data-index"));
                const newQty = parseInt(e.target.value);
                cart[index].quantity = newQty;
                localStorage.setItem("userCart", JSON.stringify(cart));
                clearAlerts();
                renderCart();
            }
        });
    }

    // 💳 Payment Toggle
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const onlinePayBox = document.getElementById("onlinePayBox");
    const desktopPayment = document.getElementById("desktopPayment");
    const mobilePayment = document.getElementById("mobilePayment");
    const confirmPaymentArea = document.getElementById("confirmPaymentArea");

    function updatePaymentUI() {
        clearAlerts();
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        if (selectedMethod === "ONLINE") {
            if (onlinePayBox) onlinePayBox.style.display = "block";
            if (isMobile) {
                if (mobilePayment) mobilePayment.style.display = "block";
                if (desktopPayment) desktopPayment.style.display = "none";
            } else {
                if (desktopPayment) desktopPayment.style.display = "block";
                if (mobilePayment) mobilePayment.style.display = "none";
                if (confirmPaymentArea) confirmPaymentArea.style.display = "block"; 
            }
        } else {
            if (onlinePayBox) onlinePayBox.style.display = "none";
            if (confirmPaymentArea) confirmPaymentArea.style.display = "none";
        }
    }

    paymentRadios.forEach(radio => {
        radio.addEventListener("change", updatePaymentUI);
    });

    async function sendOrderToTelegram(orderDetails, alertElementId) {
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
        message += `💳 Payment Method: ${orderDetails.paymentMethod}\n`;
        if (orderDetails.transactionId) {
            message += `🔢 UTR / Txn ID: ${orderDetails.transactionId}\n`;
        }
        message += `⏳ Status: Pending (Cross-check Bank Statement)`;

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        try {
            showAlert(alertElementId, "অর্ডার প্রসেস হচ্ছে, দয়া করে অপেক্ষা করুন...", "info");
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
            });

            if (response.ok) {
                showAlert(alertElementId, "🎉 আপনার অর্ডারটি সফলভাবে জমা হয়েছে!", "success");
                localStorage.removeItem("userCart");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            } else {
                showAlert(alertElementId, "অর্ডার সার্ভার ত্রুটি! আবার চেষ্টা করুন।", "error");
            }
        } catch (error) {
            console.error("Telegram error:", error);
            showAlert(alertElementId, "নেটওয়ার্ক সমস্যা! আপনার ইন্টারনেট কানেকশন চেক করুন।", "error");
        }
    }

    // 🟢 সবুজ বোতাম (I Have Paid) ক্লিক হ্যান্ডলার
    const iHavePaidBtn = document.getElementById("iHavePaidBtn");
    if (iHavePaidBtn) {
        iHavePaidBtn.addEventListener("click", () => {
            clearAlerts();
            if (!globalOrderDetails) {
                showAlert("paymentAlertMsg", "⚠️ দয়া করে প্রথমে উপরে 'Proceed to Buy' বোতামে ক্লিক করে পেমেন্ট করুন!", "error");
                return;
            }

            const txnInput = document.getElementById("transactionId");
            const txnId = txnInput ? txnInput.value.trim() : "";

            if (txnId === "" || txnId.length < 10) {
                showAlert("paymentAlertMsg", "❌ ভুল আইডি! টাকা পাঠানোর পর সঠিক UTR / Transaction ID নম্বরটি টাইপ করুন।", "error");
                if (txnInput) txnInput.focus();
                return;
            }

            globalOrderDetails.transactionId = txnId; 
            sendOrderToTelegram(globalOrderDetails, "paymentAlertMsg");
        });
    }

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            clearAlerts();
            if (cart.length === 0) {
                showAlert("mainAlertMsg", "🛒 আপনার কার্ট একদম খালি! কিছু প্রোডাক্ট যোগ করুন।", "error");
                return;
            }

            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!loggedInUser) {
                showAlert("mainAlertMsg", "👤 দয়া করে অর্ডার করার আগে আপনার অ্যাকাউন্টে লগইন করুন!", "error");
                setTimeout(() => { window.location.href = "index.html"; }, 2000);
                return;
            }

            const addressInput = document.getElementById("deliveryAddress");
            const addressText = addressInput ? addressInput.value.trim() : "";
            if (addressText === "") {
                showAlert("mainAlertMsg", "📍 ডেলিভারি সম্পূর্ণ করতে আপনার ফুল অ্যাড্রেস (ঠিকানা) লিখুন!", "error");
                if (addressInput) addressInput.focus();
                return;
            }

            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

            let orderDetails = {
                customerName: loggedInUser.name || "Unknown",
                customerPhone: loggedInUser.phone || "N/A",
                customerEmail: loggedInUser.email || "N/A",
                address: addressText,
                items: cart,
                totalAmount: totalAmount,
                paymentMethod: selectedMethod === "ONLINE" ? "Paid Online (UPI)" : "Cash on Delivery (COD)"
            };

            if (selectedMethod === "ONLINE") {
                globalOrderDetails = orderDetails; 

                if (isMobile) {
                    const upiUrl = `upi://pay?pa=${MY_UPI_ID}&pn=Roni_Shop&am=${totalAmount}&cu=INR`;
                    if (confirmPaymentArea) confirmPaymentArea.style.style = "display: block;"; 
                    if (confirmPaymentArea) confirmPaymentArea.style.display = "block";
                    
                    showAlert("mainAlertMsg", "📲 আপনাকে পেমেন্ট অ্যাপে নিয়ে যাওয়া হচ্ছে। পেমেন্ট শেষ হলে নিচে UTR কোড দিন।", "info");
                    
                    setTimeout(() => {
                        window.location.href = upiUrl;
                    }, 1200);
                } else {
                    showAlert("mainAlertMsg", "💻 কিউআর কোডটি স্ক্যান করে পেমেন্ট করুন এবং নিচে UTR নম্বরটি দিয়ে কনফার্ম করুন।", "info");
                }
            } else {
                sendOrderToTelegram(orderDetails, "mainAlertMsg");
            }
        });
    }

    renderCart();
    updatePaymentUI();
});
