loadStudents();

async function loadStudents() {
  const students = await apiGet("/students");
  const tbody = document.getElementById("studentTable");
  tbody.innerHTML = "";
  students.forEach(s => {
    tbody.innerHTML += `
      <tr>
        <td>${s.name}</td><td>${s.rollNo}</td><td>${s.department || ""}</td><td>${s.phone || ""}</td>
        <td class="actions">
          <button onclick='editStudent(${JSON.stringify(s)})'>Edit</button>
          <button onclick="deleteStudent(${s.id})">Delete</button>
        </td>
      </tr>`;
  });
}

function editStudent(s) {
  document.getElementById("formTitle").innerText = "Edit Student";
  document.getElementById("studentId").value = s.id;
  document.getElementById("name").value = s.name;
  document.getElementById("rollNo").value = s.rollNo;
  document.getElementById("department").value = s.department || "";
  document.getElementById("phone").value = s.phone || "";
}

async function saveStudent() {
  const id = document.getElementById("studentId").value;
  const data = {
    name: document.getElementById("name").value,
    rollNo: document.getElementById("rollNo").value,
    department: document.getElementById("department").value,
    phone: document.getElementById("phone").value
  };
  try {
    if (id) await apiPut("/students/" + id, data);
    else await apiPost("/students", data);
    document.getElementById("msg").innerText = "Saved!";
    document.getElementById("msg").className = "success";
    clearForm();
    loadStudents();
  } catch (e) {
    document.getElementById("msg").innerText = e.message;
    document.getElementById("msg").className = "error";
  }
}

function clearForm() {
  document.getElementById("formTitle").innerText = "Add Student";
  ["studentId","name","rollNo","department","phone"].forEach(id =>
    document.getElementById(id).value = "");
}

async function deleteStudent(id) {
  if (!confirm("Delete this student?")) return;
  try {
    await apiDelete("/students/" + id);
    loadStudents();
  } catch (e) {
    alert("Cannot delete: student has issued books.");
  }
}