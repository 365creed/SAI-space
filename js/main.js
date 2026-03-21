console.log("SAI Space Loaded");


/* =========================
   NAV ACTIVE
========================= */

/* =========================
   MAP LINKS (주소로 자동 생성)
========================= */
function setMapLinks() {
  const mapLinks = document.querySelectorAll(".map-btn[data-map][data-address]");

  mapLinks.forEach((link) => {
    const mapType = link.getAttribute("data-map");
    const address = link.getAttribute("data-address") || "";
    const encoded = encodeURIComponent(address);

    let url = "#";
    if (mapType === "naver") {
      url = `https://map.naver.com/v5/search/${encoded}`;
    } else if (mapType === "kakao") {
      url = `https://map.kakao.com/?q=${encoded}`;
    } else if (mapType === "tmap") {
      url = `https://map.tmap.co.kr/search?searchKeyword=${encoded}`;
    }

    link.href = url;
  });
}

document.addEventListener("DOMContentLoaded", setMapLinks);

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
