document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-btn");
    const sideSidebar = document.querySelector(".hyper");
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation(); 
        sideSidebar.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
        if (!sideSidebar.contains(e.target) && sideSidebar.classList.contains("active")) {
            sideSidebar.classList.remove("active");
        }
    });
    const searchBar = document.getElementById("searchBar");
    const searchBtn = document.querySelector(".search-btn");
    const searchBlock = document.getElementById("searchBlock");
    const searchTitle = document.getElementById("searchTitle");
    const searchResultsContainer = document.getElementById("searchResultsContainer");
    const allProducts = document.querySelectorAll(".product, .product-card-scroll, .grid-item");
    function performSearch() {
        const query = searchBar.value.trim().toLowerCase();
        searchResultsContainer.innerHTML = ""; 
        if (query === "") {
            searchBlock.style.display = "none";
            return;
        }
        let matchCount = 0;
        allProducts.forEach(product => {
            const pTag = product.querySelector("p");
            if (!pTag) return;
            const productName = pTag.textContent.toLowerCase();   
            if (productName.includes(query)) {
                matchCount++;              
                const clonedProduct = product.cloneNode(true);
                clonedProduct.className = "product";
                clonedProduct.style.display = "flex";             
                clonedProduct.addEventListener("click", () => {
                    openProductModal(clonedProduct);
                });
                searchResultsContainer.appendChild(clonedProduct);
            }
        });
        if (matchCount > 0) {
            searchBlock.style.display = "block";
            searchTitle.textContent = `🔍 Search Results (${matchCount} items found)`;
        } else {
            searchBlock.style.display = "block";
            searchTitle.textContent = `❌ No items found matching "${searchBar.value}"`;
        }
        searchBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    searchBtn.addEventListener("click", performSearch);
    searchBar.addEventListener("keyup", (e) => {
        if (e.key === "Enter") performSearch();
    });
    const modal = document.getElementById("productModal");
    const closeBtn = document.querySelector(".close-btn");  
    const modalImg = document.getElementById("modalProductImg");
    const modalName = document.getElementById("modalProductName");
    const modalWeight = document.getElementById("modalProductWeight");
    const modalPrice = document.getElementById("modalProductPrice");
    function openProductModal(element) {
        const name = element.querySelector("p").textContent;
        const imgUrl = element.querySelector("img").src;
        const price = element.getAttribute("data-price") || "₹99";
        const weight = element.getAttribute("data-weight") || "Pack of 1";
        modalImg.src = imgUrl;
        modalName.textContent = name;
        modalWeight.textContent = weight;
        modalPrice.textContent = price;
        modal.style.display = "block";
    }
    allProducts.forEach(product => {
        product.addEventListener("click", () => {
            openProductModal(product);
        });
    });
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
    document.querySelector(".add-to-cart-btn").addEventListener("click", () => {
        const qty = document.getElementById("prodQty").value;
        alert(`${qty}Kg or Pieces ${modalName.textContent} আপনার কার্টে যোগ করা হয়েছে!🛒`);
        modal.style.display = "none";
    });
});
