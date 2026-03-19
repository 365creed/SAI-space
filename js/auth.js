function login() {
  const pass = document.getElementById("adminPass").value;

  if (pass === "1234") {
    localStorage.setItem("admin", "true");
    location.href = "admin.html";
  } else {
    alert("비밀번호 틀림");
  }
}
