const ADMIN_ID = "sai-admin";
const ADMIN_PASSWORD = "SAI-demo-2026";

function login() {
  const id = document.getElementById("adminId").value.trim();
  const pass = document.getElementById("adminPass").value.trim();
  if (!id || !pass) {
    alert("아이디와 비밀번호를 입력하세요");
    return;
  }

  if (id === ADMIN_ID && pass === ADMIN_PASSWORD) {
    localStorage.setItem("admin", "true");
    location.href = "admin.html";
    return;
  }

  alert("아이디 또는 비밀번호가 올바르지 않습니다.");
}
