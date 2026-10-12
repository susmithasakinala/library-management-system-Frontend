loadDropdowns();
loadIssuedBooks();

async function loadDropdowns() {
  const students = await apiGet("/students");
  const books = await apiGet("/books");
  const studentSelect = document.getElementById("studentSelect");
  students.forEach(s => studentSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.rollNo})</option>`);
  const bookSelect = document.getElementById("bookSelect");
  books.forEach(b => bookSelect.innerHTML += `<option value="${b.id}">${b.title} (${b.available} available)</option>`);
}

async function issueBook() {
  const studentId = document.getElementById("studentSelect").value;
  const bookId = document.getElementById("bookSelect").value;
  try {
    const result = await apiPost("/issues", { studentId: Number(studentId), bookId: Number(bookId) });
    document.getElementById("msg").innerText =
      "Book issued to " + result.student.name + ". Return it by " + result.dueDate + " to avoid a fine.";
    document.getElementById("msg").className = "success";
    loadIssuedBooks();
  } catch (e) {
    document.getElementById("msg").innerText = e.message;
    document.getElementById("msg").className = "error";
  }
}

async function loadIssuedBooks() {
  const records = await apiGet("/issues?status=ISSUED");
  const overdue = await apiGet("/issues/overdue");

  // quick lookup: issue id -> its overdue details
  const lateById = {};
  overdue.forEach(o => lateById[o.id] = o);

  const tbody = document.getElementById("issueTable");
  tbody.innerHTML = "";
  records.forEach(r => {
    const late = lateById[r.id];
    const fineCell = late
      ? `<span class="badge-fine">Rs. ${late.fine} (${late.daysLate} days late)</span>`
      : "-";
    tbody.innerHTML += `
      <tr>
        <td>${r.student.name} (${r.student.rollNo})</td>
        <td>${r.book.title}</td>
        <td>${r.issueDate}</td>
        <td style="color:${late ? '#d63031' : '#222'}">${r.dueDate}</td>
        <td>${fineCell}</td>
        <td>
          <button onclick="returnBook(${r.id})">Return</button>
          <button class="btn-overdue" onclick="markOverdue(${r.id})">Overdue</button>
        </td>
      </tr>`;
  });
}

async function markOverdue(id) {
  const input = prompt("How many days overdue?\n(1-3 = Rs.10, 4-7 = Rs.20, 8-14 = Rs.50, 15+ = Rs.100)", "1");
  if (input === null) return;               // pressed Cancel
  const days = Math.floor(Number(input));
  if (!days || days < 1) {
    alert("Please enter a number of days, 1 or more");
    return;
  }
  try {
    await apiPut("/issues/" + id + "/overdue", { days: days });
    loadIssuedBooks();
  } catch (e) {
    alert(e.message);
  }
}

async function returnBook(id) {
  try {
    const result = await apiPut("/issues/" + id + "/return", {});
    const name = result.student.name;
    if (result.fineAmount > 0) {
      alert("Book returned late by " + name + ".\nFine to pay: Rs. " + result.fineAmount);
    } else {
      alert("Book returned by " + name + " on time. No fine.");
    }
    loadIssuedBooks();
  } catch (e) {
    alert(e.message);
  }
}