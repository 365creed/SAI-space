console.log("SAI Space Loaded");


/* =========================
   NAV ACTIVE
========================= */

const links = document.querySelectorAll(".nav a");

links.forEach(link => {

if(link.href === window.location.href){

link.style.color = "#1b63d6";

}

});


/* =========================
   SCROLL HEADER SHADOW
========================= */

window.addEventListener("scroll",()=>{

const header = document.querySelector(".header");

if(window.scrollY > 20){

header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";

}else{

header.style.boxShadow = "none";

}

});
