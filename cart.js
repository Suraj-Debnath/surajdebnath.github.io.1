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
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            
            if (cart.length === 0) return showAlert("mainAlertMsg", "কার্ট খালি!", "error");
            if (!loggedInUser) return showAlert("mainAlertMsg", "লগইন করুন!", "error");
            if (addressText === "") return showAlert("mainAlertMsg", "ঠিকানা লিখুন!", "error");

            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

            globalOrderDetails = { 
                customerName: loggedInUser.name,
                customerPhone: loggedInUser.phone,
                customerEmail: loggedInUser.email,
                address: addressText, 
                items: cart, 
                totalAmount, 
                paymentMethod: selectedMethod 
            };

            if (selectedMethod === "ONLINE") {
                if (confirmPaymentArea) confirmPaymentArea.style.display = "block";
                if (isMobile) {
                    const upiUrl = `upi://pay?pa=${MY_UPI_ID}&pn=Roni_Shop&am=${totalAmount}&cu=INR`;
                    showAlert("mainAlertMsg", "পেমেন্ট অ্যাপে যাওয়া হচ্ছে...", "info");
                    window.location.href = upiUrl;
                } else {
                    showAlert("mainAlertMsg", "QR স্ক্যান করে নিচে UTR নম্বর দিন।", "info");
                }
            } else {
                sendOrderToTelegram(globalOrderDetails, "mainAlertMsg");
            }
        });
    }

    const iHavePaidBtn = document.getElementById("iHavePaidBtn");
    if (iHavePaidBtn) {
        iHavePaidBtn.addEventListener("click", () => {
            clearAlerts();
            const txnId = document.getElementById("transactionId").value.trim();
            if (!globalOrderDetails) return showAlert("paymentAlertMsg", "আগে Proceed to Buy বাটনে ক্লিক করুন!", "error");
            if (txnId.length < 10) return showAlert("paymentAlertMsg", "সঠিক UTR / Txn ID দিন!", "error");

            globalOrderDetails.transactionId = txnId;
            sendOrderToTelegram(globalOrderDetails, "paymentAlertMsg");
        });
    }

    async function sendOrderToTelegram(orderDetails, alertElementId) {
        let message = `🛍️ *New Order Placed on Roni.in*\n\n👤 *Customer:* ${orderDetails.customerName}\n📞 *Phone:* ${orderDetails.customerPhone}\n📍 *Address:* ${orderDetails.address}\n\n📦 *Items:*\n`;
        orderDetails.items.forEach((item, index) => { message += `${index + 1}. ${item.name} (${item.weight}) x ${item.quantity} = ₹${item.price * item.quantity}\n`; });
        message += `\n💰 *Total:* ₹${orderDetails.totalAmount}\n💳 *Method:* ${orderDetails.paymentMethod}`;
        if(orderDetails.transactionId) message += `\n🔢 *UTR/Txn ID:* ${orderDetails.transactionId}`;

        try {
            showAlert(alertElementId, "অর্ডার প্রসেস হচ্ছে...", "info");
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'Markdown' })
            });
            if (response.ok) {
                showAlert(alertElementId, "অর্ডার সফল!", "success");
                localStorage.removeItem("userCart");
                setTimeout(() => { window.location.href = "index.html"; }, 2000);
            } else {
                showAlert(alertElementId, "ত্রুটি হয়েছে!", "error");
            }
        } catch (error) {
            showAlert(alertElementId, "নেটওয়ার্ক সমস্যা!", "error");
        }
    }
});
