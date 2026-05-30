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
});
