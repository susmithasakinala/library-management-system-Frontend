document.getElementById("welcome").innerText =
  "Welcome, " + (localStorage.getItem("userName") || "User");

loadStats();

async function loadStats() {
  const books = await apiGet("/books");
  const students = await apiGet("/students");
  const issued = await apiGet("/issues?status=ISSUED");
  const overdue = await apiGet("/issues/overdue");
  const fines = await apiGet("/issues/total-fine");

  document.getElementById("totalBooks").innerText = books.length;
  document.getElementById("totalStudents").innerText = students.length;
  document.getElementById("issuedCount").innerText = issued.length;
  document.getElementById("overdueCount").innerText = overdue.length;
  document.getElementById("totalFines").innerText = "Rs. " + fines.totalFine;

  renderOverdue(overdue);
}

function renderOverdue(list) {
  const tbody = document.getElementById("overdueTable");
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No overdue books right now.</td></tr>`;
    return;
  }
  tbody.innerHTML = "";
  list.forEach(o => {
    tbody.innerHTML += `
      <tr>
        <td>${o.studentName} (${o.rollNo})</td>
        <td>${o.bookTitle}</td>
        <td>${o.dueDate}</td>
        <td>${o.daysLate}</td>
        <td class="fine-text">Rs. ${o.fine}</td>
      </tr>`;
  });
}