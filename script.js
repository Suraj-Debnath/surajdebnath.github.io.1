 const menuBtn = document.getElementById("menu-btn");
        const hyper = document.querySelector(".hyper");
        menuBtn.addEventListener("click", ()=>{
            if(hyper.style.left === "0px"){
                  hyper.style.left = "-220px";
            }
            else{
                hyper.style.left = "0px";
            }
        });
        
const searchBar = document.getElementById("searchBar");
    searchBar.addEventListener("keyup", function(){
        let searchValue = searchBar.value.toLowerCase();
        let items = document.querySelectorAll(
            ".box, .box-1-2, .box-1-3, .box-1-4"
        );
        items.forEach(function(item){
            let text = item.innerText.toLowerCase();
            if(text.includes(searchValue)){
                item.style.display = "block";
            }
            else{
                item.style.display = "none";
            }
        });
});