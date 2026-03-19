let members = JSON.parse(localStorage.getItem("members")) || [];

function createMember() {
  const name = document.getElementById("name").value;

  const id = "M" + Math.floor(Math.random() * 10000);

  members.push({ id, name });

  localStorage.setItem("members", JSON.stringify(members));

  render();
}

function render() {
  const list = document.getElementById("memberList");
  list.innerHTML = "";

  members.forEach(m => {
    list.innerHTML += `<li>${m.name} - ${m.id}</li>`;
  });
}

render();
