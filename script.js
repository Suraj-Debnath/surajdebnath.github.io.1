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
                // ব্লিংকিং সহ সবুজ মেসেজ শুরু হবে
                showAuthMsg("সার্ভার কানেক্ট হচ্ছে, দয়া করে কয়েক সেকেন্ড অপেক্ষা করুন...", "green", true);

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
                // এখানে এরর মেসেজ বদলে ব্লিংকিং সবুজ মেসেজ দেওয়া হলো
                showAuthMsg("সার্ভার ব্যাকগ্রাউন্ডে চালু হচ্ছে... দয়া করে আর ৩০ সেকেন্ড অপেক্ষা করে আবার ক্লিক করুন।", "green", true);
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
                // ব্লিংকিং সহ সবুজ মেসেজ শুরু হবে
                showAuthMsg("সার্ভার কানেক্ট হচ্ছে, দয়া করে কয়েক সেকেন্ড অপেক্ষা করুন...", "green", true);

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
                // এখানেও এরর মেসেজ বদলে ব্লিংকিং সবুজ মেসেজ দেওয়া হলো
                showAuthMsg("সার্ভার ব্যাকগ্রাউন্ডে চালু হচ্ছে... দয়া করে আর ৩০ সেকেন্ড অপেক্ষা করে আবার ক্লিক করুন।", "green", true);
            }
        });
    }

    // মেসেজ দেখানোর ফাংশনটি আপডেট করা হলো ব্লিংক অপশন সহ
    function showAuthMsg(text, color, shouldBlink = false) {
        if (authMessage) {
            authMessage.textContent = text;
            authMessage.style.color = color;
            authMessage.style.display = "block";
            
            if (shouldBlink) {
                authMessage.style.animation = "blinkEffect 1s infinite alternate";
                
                // গ্লোবাল স্টাইলশিটে ব্লিংক অ্যানিমেশন ইনজেক্ট করা হচ্ছে (যদি না থাকে)
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
                authMessage.style.animation = "none"; // সাধারণ মেসেজের জন্য ব্লিংক বন্ধ থাকবে
            }
        }
    }

    // ... (বাকি সার্চ বার এবং কার্ট কোড আগের মতোই নিচে থাকবে)
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
            const allProducts = document.querySelectorAll(".product, .product-card-scroll, .grid-item");
            let hasResults = false;
            if (searchResultsContainer) searchResultsContainer.innerHTML = "";
            allProducts.forEach(prod => {
                const pTag = prod.querySelector("p");
                if (pTag) {
                    const productName = pTag.textContent.toLowerCase();
                    if (productName.includes(searchTerm)) {
                        hasResults = true;
                        const clone = prod.cloneNode(true);
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
        const cartCountEl = document.getElementById("cartCount");
        if (cartCountEl) {
            const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountEl.textContent = totalQty;
        }
    }
    updateCartCounter();

    const productModal = document.getElementById("productModal");
    const closeBtn = document.querySelector(".close-btn");
    let selectedProductData = null;

    document.body.addEventListener("click", (e) => {
        const productCard = e.target.closest(".product, .product-card-scroll, .grid-item");
        if (productCard && !e.target.classList.contains("add-to-cart-btn")) {
            const name = productCard.querySelector("p").textContent;
            const imgUrl = productCard.querySelector("img").src;
            const price = parseInt(productCard.getAttribute("data-price")) || 0;
            const weight = productCard.getAttribute("data-weight") || "1kg";
            selectedProductData = { name, imgUrl, price, weight };
            const mName = document.getElementById("modalProductName");
            const mImg = document.getElementById("modalProductImg");
            const mPrice = document.getElementById("modalProductPrice");
            const mWeight = document.getElementById("modalProductWeight");
            if(mName) mName.textContent = name;
            if(mImg) mImg.src = imgUrl;
            if(mPrice) mPrice.textContent = `₹${price}`;
            if(mWeight) mWeight.textContent = weight;
            const pQty = document.getElementById("prodQty");
            if(pQty) pQty.value = "1";
            if (productModal) productModal.style.display = "block";
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

    const modalAddToCartBtn = document.querySelector(".modal-right .add-to-cart-btn");
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener("click", () => {
            if (!selectedProductData) return;
            const qtySelect = document.getElementById("prodQty");
            const quantity = parseInt(qtySelect.value) || 1;
            const existingItem = cart.find(item => item.name === selectedProductData.name);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    name: selectedProductData.name,
                    price: selectedProductData.price,
                    imgUrl: selectedProductData.imgUrl,
                    weight: selectedProductData.weight,
                    quantity: quantity
                });
            }
            localStorage.setItem("userCart", JSON.stringify(cart));
            updateCartCounter();
            if (productModal) productModal.style.display = "none";
            alert(`🎉 ${selectedProductData.name} কার্টে যোগ হয়েছে!`);
        });
    }

    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const checkoutBox = document.getElementById("checkoutBox");
    const totalItemsCount = document.getElementById("totalItemsCount");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const navUserName = document.getElementById("nav-user-name");

    if (navUserName && savedUser) {
        const userObj = JSON.parse(savedUser);
        navUserName.textContent = `Hello, ${userObj.name}`;
    }

    function renderCartPage() {
        if (!cartItemsContainer) return; 
        updateCartCounter();
        if (cart.length === 0) {
            cartItemsContainer.style.display = "none";
            if (checkoutBox) checkoutBox.style.display = "none";
            if (emptyCartMessage) emptyCartMessage.style.display = "block";
            return;
        }
        cartItemsContainer.style.display = "block";
        if (checkoutBox) checkoutBox.style.display = "block";
        if (emptyCartMessage) emptyCartMessage.style.display = "none";
        cartItemsContainer.innerHTML = "";
        let grandTotal = 0;
        let totalItems = 0;
        cart.forEach((item, index) => {
            grandTotal += (item.price * item.quantity);
            totalItems += item.quantity;
            const itemHtml = `
                <div class="cart-item">
                    <img src="${item.imgUrl}" class="cart-item-img" alt="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div style="font-size: 13px; color: #565959;">Weight: ${item.weight}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="cart-action-row">
                            <label style="font-size: 13px;">Qty: 
                                <select class="cart-qty-select" data-index="${index}" style="padding: 2px 6px; border-radius: 4px;">
                                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(q => 
                                        `<option value="${q}" ${q === item.quantity ? 'selected' : ''}>${q}</option>`
                                    ).join('')}
                                </select>
                            </label>
                            <span style="color: #ddd;">|</span>
                            <button class="delete-item-btn" data-index="${index}">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += itemHtml;
        });
        if (totalItemsCount) totalItemsCount.textContent = totalItems;
        if (cartSubtotal) cartSubtotal.textContent = grandTotal;

        document.querySelectorAll(".cart-qty-select").forEach(select => {
            select.addEventListener("change", (e) => {
                const idx = parseInt(e.target.getAttribute("data-index"));
                cart[idx].quantity = parseInt(e.target.value);
                localStorage.setItem("userCart", JSON.stringify(cart));
                renderCartPage();
            });
        });

        document.querySelectorAll(".delete-item-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.getAttribute("data-index"));
                cart.splice(idx, 1);
                localStorage.setItem("userCart", JSON.stringify(cart));
                renderCartPage();
            });
        });
    }

    renderCartPage();

    const proceedToBuyBtn = document.getElementById("proceedToBuyBtn");
    if (proceedToBuyBtn) {
        proceedToBuyBtn.addEventListener("click", () => {
            alert("🎉 Order Placed Successfully! Thank you for shopping with Roni.in.");
            cart = [];
            localStorage.removeItem("userCart");
            renderCartPage();
        });
    }
});
