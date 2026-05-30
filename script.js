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
