document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    const savedUser = localStorage.getItem("loggedInUser");
    const authModal = document.getElementById("authModal");

    if (authModal) {
        if (savedUser) {
            authModal.style.display = "none";
            const userObj = JSON.parse(savedUser);
            const loginLink = document.getElementById("nav-user-signin");
            if (loginLink) loginLink.textContent = `Hello, ${userObj.name}`;
        } else {
            authModal.style.display = "block";
        }
    }

    const navUserSignin = document.getElementById("nav-user-signin");
    if (navUserSignin && !savedUser) {
        navUserSignin.addEventListener("click", (e) => {
            e.preventDefault();
            if (authModal) authModal.style.display = "block";
        });
    }

    const showSignupLink = document.getElementById("showSignupLink");
    const showLoginLink = document.getElementById("showLoginLink");
    const loginSection = document.getElementById("loginSection");
    const signupSection = document.getElementById("signupSection");
    const authMessage = document.getElementById("authMessage");

    if (showSignupLink && showLoginLink) {
        showSignupLink.addEventListener("click", (e) => {
            e.preventDefault();
            loginSection.style.display = "none";
            signupSection.style.display = "block";
            if (authMessage) authMessage.style.display = "none";
        });

        showLoginLink.addEventListener("click", (e) => {
            e.preventDefault();
            signupSection.style.display = "none";
            loginSection.style.display = "block";
            if (authMessage) authMessage.style.display = "none";
        });
    }

    const signupSubmitBtn = document.getElementById("signupSubmitBtn");
    if (signupSubmitBtn) {
        signupSubmitBtn.addEventListener("click", async () => {
            const name = document.getElementById("signupName").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const phone = document.getElementById("signupPhone").value.trim();
            const password = document.getElementById("signupPassword").value.trim();

            if (!name || !email || !phone || !password) {
                showAuthMsg("সবগুলো ঘর সঠিকভাবে পূরণ করুন!", "red");
                return;
            }

            try {
                showAuthMsg("সার্ভার কানেক্ট হচ্ছে, দয়া করে কয়েক সেকেন্ড অপেক্ষা করুন...", "green", true);

                const response = await fetch('https://backend-7k8k.onrender.com/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, password })
                });
                const data = await response.json();

                if (data.success) {
                    showAuthMsg("অ্যাকাউন্ট তৈরি হয়েছে! এবার লগইন করুন।", "green", false);
                    setTimeout(() => {
                        signupSection.style.display = "none";
                        loginSection.style.display = "block";
                        if (authMessage) authMessage.style.display = "none";
                    }, 2000);
                } else {
                    showAuthMsg(data.message, "red", false);
                }
            } catch (error) {
                showAuthMsg("সার্ভার ব্যাকগ্রাউন্ডে চালু হচ্ছে... দয়া করে আর ৩০ সেকেন্ড অপেক্ষা করে আবার ক্লিক করুন।", "green", true);
            }
        });
    }

    const loginSubmitBtn = document.getElementById("loginSubmitBtn");
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener("click", async () => {
            const emailOrPhone = document.getElementById("loginEmailPhone").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            if (!emailOrPhone || !password) {
                showAuthMsg("ইউজারনেম এবং পাসওয়ার্ড দিন!", "red");
                return;
            }

            try {
                showAuthMsg("সার্ভার কানেক্ট হচ্ছে, দয়া করে কয়েক সেকেন্ড অপেক্ষা করুন...", "green", true);

                const response = await fetch('https://backend-7k8k.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emailOrPhone, password })
                });
                const data = await response.json();

                if (data.success) {
                    localStorage.setItem("loggedInUser", JSON.stringify(data.user));
                    showAuthMsg("লগইন সফল! পেজ লোড হচ্ছে...", "green", false);
                    setTimeout(() => {
                        if (authModal) authModal.style.display = "none";
                        window.location.reload();
                    }, 1000);
                } else {
                    showAuthMsg(data.message, "red", false);
                }
            } catch (error) {
                showAuthMsg("সার্ভার ব্যাকগ্রাউন্ডে চালু হচ্ছে... দয়া করে আর ৩০ সেকেন্ড অপেক্ষা করে আবার ক্লিক করুন।", "green", true);
            }
        });
    }

    function showAuthMsg(text, color, shouldBlink = false) {
        if (authMessage) {
            authMessage.textContent = text;
            authMessage.style.color = color;
            authMessage.style.display = "block";
            
            if (shouldBlink) {
                authMessage.style.animation = "blinkEffect 1s infinite alternate";
                if (!document.getElementById("blink-style")) {
                    const style = document.createElement("style");
                    style.id = "blink-style";
                    style.innerHTML = `
                        @keyframes blinkEffect {
                            from { opacity: 1; }
                            to { opacity: 0.2; }
                        }
                    `;
                    document.head.appendChild(style);
                }
            } else {
                authMessage.style.animation = "none"; 
            }
        }
    }

    const searchBar = document.getElementById("searchBar");
    const searchBlock = document.getElementById("searchBlock");
    const searchResultsContainer = document.getElementById("searchResultsContainer");

    if (searchBar) {
        searchBar.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            if (searchTerm === "") {
                if (searchBlock) searchBlock.style.display = "none";
                return;
            }
            const allProducts = document.querySelectorAll(".main .product, .main .product-card-scroll, .main .grid-item");
            let hasResults = false;
            if (searchResultsContainer) searchResultsContainer.innerHTML = "";
            allProducts.forEach(prod => {
                const pTag = prod.querySelector("p");
                if (pTag) {
                    const productName = pTag.textContent.toLowerCase();
                    if (productName.includes(searchTerm)) {
                        hasResults = true;
                        const clone = prod.cloneNode(true);
                        clone.setAttribute("data-price", prod.getAttribute("data-price"));
                        clone.setAttribute("data-weight", prod.getAttribute("data-weight"));
                        if (searchResultsContainer) searchResultsContainer.appendChild(clone);
                    }
                }
            });
            if (hasResults) {
                if (searchBlock) searchBlock.style.display = "block";
            } else {
                if (searchBlock) searchBlock.style.display = "none";
            }
        });
    }

    function updateCartCounter() {
        const cartCountElements = document.querySelectorAll(".cartCount");
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(el => {
            el.textContent = totalQty;
        });
    }
    updateCartCounter();

    const productModal = document.getElementById("productModal");
    const closeBtn = document.querySelector(".close-btn");
    const qtySelect = document.getElementById("prodQty");
    let selectedProductData = null;

    function updateModalLivePrice() {
        if (!selectedProductData) return;
        const currentQty = parseInt(qtySelect.value) || 1;
        const totalPrice = selectedProductData.basePrice * currentQty;
        const mPrice = document.getElementById("modalProductPrice");
        if (mPrice) mPrice.textContent = `₹${totalPrice}`;
    }

    if (qtySelect) {
        qtySelect.addEventListener("change", updateModalLivePrice);
    }

    document.body.addEventListener("click", (e) => {
        const productCard = e.target.closest(".product, .product-card-scroll, .grid-item");
        if (productCard && !e.target.classList.contains("add-to-cart-btn")) {
            const pTag = productCard.querySelector("p");
            const imgTag = productCard.querySelector("img");

            if (pTag && imgTag) {
                const name = pTag.textContent;
                const imgUrl = imgTag.src;
                const price = parseInt(productCard.getAttribute("data-price")) || 0;
                const weight = productCard.getAttribute("data-weight") || "1kg";
                
                selectedProductData = { name, imgUrl, basePrice: price, weight };
                
                const mName = document.getElementById("modalProductName");
                const mImg = document.getElementById("modalProductImg");
                const mWeight = document.getElementById("modalProductWeight");
                
                if(mName) mName.textContent = name;
                if(mImg) mImg.src = imgUrl;
                if(mWeight) mWeight.textContent = weight;
                if(qtySelect) qtySelect.value = "1";
                
                updateModalLivePrice();
                
                if (productModal) productModal.style.display = "block";
            }
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            if (productModal) productModal.style.display = "none";
        });
    }
    window.addEventListener("click", (e) => {
        if (e.target === productModal) {
            if (productModal) productModal.style.display = "none";
        }
    });

    const modalAddToCartBtn = document.querySelector("#productModal .add-to-cart-btn");
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener("click", () => {
            if (!selectedProductData) return;
            const quantity = parseInt(qtySelect ? qtySelect.value : 1);
            const existingItem = cart.find(item => item.name === selectedProductData.name);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    name: selectedProductData.name,
                    imgUrl: selectedProductData.imgUrl,
                    price: selectedProductData.basePrice,
                    weight: selectedProductData.weight,
                    quantity: quantity
                });
            }

            localStorage.setItem("userCart", JSON.stringify(cart));
            updateCartCounter();
            if (productModal) productModal.style.display = "none";
        });
    }

    const modalBuyNowBtn = document.querySelector("#productModal .buy-now-btn");
    if (modalBuyNowBtn) {
        modalBuyNowBtn.addEventListener("click", () => {
            if (!selectedProductData) return;
            const quantity = parseInt(qtySelect ? qtySelect.value : 1);
            const existingItem = cart.find(item => item.name === selectedProductData.name);
            
            if (existingItem) {
                existingItem.quantity = quantity;
            } else {
                cart.push({
                    name: selectedProductData.name,
                    imgUrl: selectedProductData.imgUrl,
                    price: selectedProductData.basePrice,
                    weight: selectedProductData.weight,
                    quantity: quantity
                });
            }

            localStorage.setItem("userCart", JSON.stringify(cart));
            window.location.href = "cart.html";
        });
    }

    const menuBtn = document.getElementById("menu-btn");
    const sidebarMenu = document.getElementById("sidebarMenu");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");

    if (menuBtn && sidebarMenu) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebarMenu.classList.add("active");
        });
    }

    if (closeSidebarBtn && sidebarMenu) {
        closeSidebarBtn.addEventListener("click", () => {
            sidebarMenu.classList.remove("active");
        });
    }

    document.addEventListener("click", (e) => {
        if (sidebarMenu && sidebarMenu.classList.contains("active")) {
            if (!sidebarMenu.contains(e.target) && e.target !== menuBtn) {
                sidebarMenu.classList.remove("active");
            }
        }
    });
});

    const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; 
    const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE'; 

    async function sendOrderToTelegram(orderDetails) {
        let message = `🛍️ *New Order Placed on Roni.in* 🛍️\n\n`;
        message += `👤 *Customer:* ${orderDetails.customerName}\n`;
        message += `📞 *Phone:* ${orderDetails.customerPhone}\n`;
        message += `📧 *Email:* ${orderDetails.customerEmail}\n\n`;
        message += `📦 *Products:* \n`;
        
        orderDetails.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name} (${item.weight}) x ${item.quantity} = ₹${item.price * item.quantity}\n`;
        });
        
        message += `\n💰 *Total Amount:* ₹${orderDetails.totalAmount}\n`;
        message += `📍 *Status:* Pending Cash on Delivery`;

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
            alert("অর্ডার সফল হয়েছে! আপনার কাছে শীঘ্রই কনফার্মেশন কল যাবে।");
            localStorage.removeItem("userCart");  
            window.location.href = "index.html"; 
        } catch (error) {
            console.error("টেলিগ্রামে মেসেজ পাঠাতে সমস্যা হয়েছে:", error);
            alert("অর্ডার প্রসেস করতে কিছুটা সমস্যা হয়েছে, দয়া করে আবার চেষ্টা করুন।");
        }
    }

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("আপনার কার্ট খালি!");
                return;
            }

            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!loggedInUser) {
                alert("অর্ডার করতে দয়া করে আগে লগইন করুন!");
                if (authModal) authModal.style.display = "block";
                return;
            }

            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const orderDetails = {
                customerName: loggedInUser.name || "Unknown",
                customerPhone: loggedInUser.phone || "N/A",
                customerEmail: loggedInUser.email || "N/A",
                items: cart,
                totalAmount: totalAmount
            };

            sendOrderToTelegram(orderDetails);
        });
    }
