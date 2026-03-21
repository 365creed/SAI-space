function login() {
  const id = document.getElementById("adminId").value.trim() || "admin";
  const pass = document.getElementById("adminPass").value.trim();
  if (!pass) {
    alert("비밀번호를 입력하세요");
    return;
  }

  const authRaw = localStorage.getItem("adminAuth");

  // 최초 1회: 입력한 정보로 관리자 계정 설정(코드에 비밀번호 하드코딩 없음)
  if (!authRaw) {
    localStorage.setItem("adminAuth", JSON.stringify({ id, password: pass }));
    localStorage.setItem("admin", "true");
    location.href = "admin.html";
    return;
  }

  const auth = JSON.parse(authRaw);

  if (id === auth.id && pass === auth.password) {
    localStorage.setItem("admin", "true");
    location.href = "admin.html";
    return;
  }

  alert("아이디 또는 비밀번호가 올바르지 않습니다.");
}
