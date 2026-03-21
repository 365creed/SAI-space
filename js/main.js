console.log("SAI Space Loaded");


/* =========================
   NAV ACTIVE
========================= */

const links = document.querySelectorAll(".nav a");
const currentFile =
  window.location.pathname.split(/[/\\]/).filter(Boolean).pop() || "index.html";

links.forEach((link) => {
  const href = link.getAttribute("href");
  if (href && (href === currentFile || (currentFile === "" && href === "index.html"))) {
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
